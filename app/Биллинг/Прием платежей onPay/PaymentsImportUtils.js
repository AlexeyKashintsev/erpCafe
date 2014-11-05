/**
 * Модуль, содержащий функции импорта данных о клиентских платежах. 
 * @author ml
 * @module
 */
function PaymentsImportUtils() {
    var self = this, model = this.model;
    var paymentsUtils = new PaymentsUtils(),
            subscriberAccountUtils = new SubscriberAccountUtils();
    var IMPORT_ERROR = "Ошибка импорта: ";

    /**
     * Импортирует данные о клиентских платежах из файла выгрузки операций по счету, 
     * сформированном в формате обмена данными «Банк-Клиент»-«1С:Предприятие».
     * @param {String} aPath Путь к файлу с данными.
     * @returns {String} Пустая строка, если импорт выполнен успешно. 
     * Иначе - строка с сообщением об ошибке.
     */
    this.importFrom1cFormat = function(aPath) {
        try {
            if (aPath) {
                var txt = readString(aPath, "cp1251");
                // выбираем только блоки данных для документов вида "Платежное поручение"
                var paymentOrders = txt.match(/СекцияДокумент=Платежное поручение([\s\S]*?)КонецДокумент/g);
                paymentOrders.forEach(function(paymentOrder) {
                    var receiptDate = paymentOrder.match(/^ДатаПоступило=([\S]*)$/m);
                    // отсеиваем платежные поручения, где не указана дата поступления средств на расчетный счет,
                    // т.е. если не известно, что документ проведен по расчетному счету получателя.
                    if (receiptDate && receiptDate.length && receiptDate[1]) {
                        var splittedDate = receiptDate[1].split(".");
                        if (splittedDate.length === 3) {
                            var dt = new Date(splittedDate[2],
                                    (splittedDate[1][0] === "0" ? parseInt(splittedDate[1][1]) : parseInt(splittedDate[1])) - 1,
                                    splittedDate[0]);
                            // получаем номер платежного поручения
                            var docNum = paymentOrder.match(/^Номер=([\S]+)$/m);
                            if (docNum && docNum.length && docNum[1]) {
                                //получаем ИНН плательщика - таким образом идентифицируем абонента для нашего биллинга
                                var inn = paymentOrder.match(/^ПлательщикИНН=(\d{10})$/m); // 10 цифр - юридические лица
                                if (inn && inn.length && inn[1]) {
                                    //получаем id абонента по ИНН
                                    var subscriber = paymentsUtils.getSubscriberByINN(inn[1]);
                                    if (subscriber) {
                                        if (!paymentsUtils.findOperationByPayment(subscriber, model.dsBillingSettings.cursor.pay_src_1c_interchange_file, docNum[1], dt)) {
                                            // получаем сумму платежа
                                            var sum = paymentOrder.match(/^Сумма=(\d+\.{0,1}\d{0,2})$/m);
                                            if (sum && sum.length && sum[1]) {
                                                var orderAmount = parseFloat(sum[1]);
                                                if (!isNaN(orderAmount) && orderAmount) {
                                                    Logger.info("ИНН:" + inn[1] + ", абонент: " + subscriber + 
                                                            ", сумма: " + orderAmount + ", № док: " + docNum[1] + ", дата док.: " + dt);
                                                    // зачисляем сумму на лицевой счет абонента
                                                    var res = subscriberAccountUtils.topUp({
                                                        subscriber: subscriber,
                                                        sum: orderAmount,
                                                        comment: "Пополнение счета",
                                                        paymentSystem: model.dsBillingSettings.cursor.pay_src_1c_interchange_file,
                                                        paymentId: docNum[1],
                                                        paymentDate: dt
                                                    });
                                                    if (!res)
                                                        Logger.severe(IMPORT_ERROR + "для абонента" + subscriber + "не создана операция зачисления на лицевой счет.");
                                                }
                                            }
                                        }
                                    } else
                                        Logger.severe(IMPORT_ERROR + "не найден абонент с ИНН " + inn[1]);
                                }
                            }
                        }
                    }
                });
            } else
                throw IMPORT_ERROR + " не указан путь к файлу с данными.";
            return "";
        } catch (e) {
            Logger.severe(e);
            return e.toString();
        }
    };
}
