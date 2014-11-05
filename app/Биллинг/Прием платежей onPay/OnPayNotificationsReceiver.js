/**
 * Модуль, содержащий функции для обработки извещений о транзакциях, приходящих
 * от платежного агрегатора OnPay.ru
 *
 * @author ml
 * @stateless
 * @module
 * @public
 * @see http://wiki.onpay.ru/doku.php?id=api-notify
 */
function OnPayNotificationsReceiver() {
    var self = this, model = self.model;
    var datesUtils = new DatesUtils(),
            paymentsUtils = new PaymentsUtils(),
            subscriberAccountUtils = new SubscriberAccountUtils();

    var MERCHANT_API_IN_KEY = "eQKfai4E8QW";

    /**
     * Название параметра http-запроса, содержащего "прикладной" тип запроса, присылаемого платежной системой OnPay.ru
     * @type String
     */
    var TYPE = 'type';

    /**
     * "Прикладной" тип запроса - проверка возможности принятия платежа.
     * @type String
     */
    var CHECK_TYPE = "check";

    /**
     * "Прикладной" тип запроса - принятие платежа.
     * @type String
     */
    var PAY_TYPE = "pay";

    /**
     * Название параметра http-запроса, содержащего идентификатор платежа в системе приёма платежей OnPay.ru
     * @type String
     */
    var PAY_ID = "onpay_id";

    /**
     * Название параметра http-запроса, содержащего идентификатор абонента, для которого производится платеж.
     * @type String
     */
    var PAY_FOR = "pay_for";

    /**
     * Название параметра http-запроса, содержащего сумму платежа.
     * @type String
     */
    var ORDER_AMOUNT = "order_amount";

    /**
     * Название параметра http-запроса, содержащего обозначение валюты платежа.
     * @type String
     */
    var ORDER_CURRENCY = "order_currency";

    /**
     * Название параметра http-запроса, содержащего сумму, которая будет внесена на баланс.
     * @type String
     */
    var BALANCE_AMOUNT = "balance_amount";

    /**
     * Название параметра http-запроса, содержащего обозначение валюты, в которой сумма платежа будет зачислена на баланс Мерчанта.
     * @type String
     */
    var BALANCE_CURRENCY = "balance_currency";

    /**
     * Название параметра http-запроса, содержащего курс обмена, по которому сумма платежа (“order_amount”) была конвертирована в сумму к получению (“balance_amount”).
     * @type String
     */
    var EXCHANGE_RATE = "exchange_rate";

    /**
     * Название параметра http-запроса, содержащего дату и время, в которое платёж был получен системой OnPay.<br/>
     * Для определения даты Onpay.ru использует один из форматов рекомендованных стандартом ISO8601:2000. Этот формат включён в “XML Schema Part 2: Datatypes” под именем DateTime:<br/><br/>
     * <i>MM-DDThh:mm:ss.fZZZZZ</i><br/><br/>
     * Где:<br/>
     * <i>YYYY</i> – год, 4 цифры<br/>
     * <i>MM</i> – месяц, 2 цифры (01 – Январь, и т.д.)<br/>
     * <i>DD</i> – день, 2 цифры (от 01 до 31)<br/>
     * <i>T</i> – символ “T”, верхний регистр<br/>
     * <i>hh</i> – hours, 2 цифры (24 часовой формат, от 00 до 23)<br/>
     * <i>mm</i> – minutes, 2 цифры (от 00 до 59)<br/>
     * <i>ss</i> – seconds, 2 цифры (от 00 до 59)<br/>
     * <i>f</i> – от 1 до 6 цифр, доли секунды<br/>
     * <i>ZZZZZ</i> – временная зона, в формате +чч:мм или -чч:мм от UTC. Установленный символ Z означает время UTC<br/>
     * @example <i>2006-03-24T19:00:00+03:00</i> – 19 часов 24 марта 2006 года, зона – UTC + 3 часа<br/>
     * <i>2006-03-24T16:00:00Z</i> – та же дата, но в зоне UTC.
     * @type {String}
     */
    var PAYMENT_DATETIME = "paymentDateTime";

    /**
     * Название параметра http-запроса, содержащего хэш подпись платежа (строку в верхнем регистре).
     * @type String
     */
    var MD5 = "md5";

    /**
     * “Уведомление о платеже принято”, если тип запроса был <i>pay</i>,
     *  или “может быть принято”, если тип запроса был <i>check</i>.
     *  @type Number
     */
    var COMPLETION_CODE_OK = 0;

    /**
     * Только для запросов типа <i>check</i> Платёж отклонён.
     * В этом случае OnPay не примет платёж от Клиента.
     *  @type Number
     */
    var COMPLETION_CODE_NOT_ALLOWED = 2;

    /**
     * Ошибка в параметрах. OnPay не будет пытаться повторно послать это уведомление в API мерчанта
     * и отметит этот платёж статусом “уведомление не доставлено в API”, если тип запроса <i>pay</i>.
     * Если тип запроса <i>check</i> – OnPay не примет этот платеж.
     *  @type Number
     */
    var COMPLETION_CODE_PARAMS_ERROR = 3;

    /**
     * Ошибка авторизации. MD5 подпись неверна.
     *  @type Number
     */
    var COMPLETION_CODE_MD5_ERROR = 7;

    /**
     * Временная ошибка. OnPay попробует повторно послать это уведомление несколько раз
     * в течение следующих 72 часов, после чего пометит платёж статусом “уведомление не доставлено в API”
     *  @type Number
     */
    var COMPLETION_CODE_TIME_ERROR = 10;

    /**
     * Принимает и обрабатывает http-запрос от платежного агрегатора OnPay.ru и
     * формирует ответ в требуемом формате.
     */
    this.receive = function() {
        switch (self.http.request.params[TYPE]) {
            case CHECK_TYPE :
                return check(
                        self.http.request.params[PAY_FOR],
                        self.http.request.params[ORDER_AMOUNT],
                        self.http.request.params[ORDER_CURRENCY],
                        self.http.request.params[BALANCE_AMOUNT],
                        self.http.request.params[BALANCE_CURRENCY],
                        self.http.request.params[MD5]);
                break;
            case PAY_TYPE :
                var pdt = datesUtils.fromIso8601(self.http.request.params[PAYMENT_DATETIME]);
                return pay(
                        self.http.request.params[PAY_ID],
                        self.http.request.params[PAY_FOR],
                        self.http.request.params[ORDER_AMOUNT],
                        self.http.request.params[ORDER_CURRENCY],
                        self.http.request.params[BALANCE_AMOUNT],
                        self.http.request.params[BALANCE_CURRENCY],
                        self.http.request.params[EXCHANGE_RATE],
                        pdt,
                        self.http.request.params[MD5]);
                break;
            default :
                break;
        }
    };

    /**
     * Проверяет возможность принятия платёжа в агрегаторе OnPay.ru. и возвращает
     *  Xml-ответ о выполнении проверки.
     * @param payFor Идентификатор абонента, для которого производится платеж
     * @param orderAmount Сумма платежа
     * @param orderCurrency Валюта
     * @param balanceAmount Сумма, которая будет внесена на баланс
     * @param balanceCurrency Валюта, в которой сумма платежа будет зачислена на баланс Мерчанта
     * @param md5 Хэш подпись платежа. Строка в верхнем регистре
     * @return {String} Строка, содержащая XML-ответ для OnPay.ru с результатом проверки.
     */
    function check(payFor, orderAmount, orderCurrency, balanceAmount, balanceCurrency, md5) {
        if (generateCheckMD5(payFor, orderAmount, orderCurrency, null, MERCHANT_API_IN_KEY) !== md5)
            return prepareCheckResponse(COMPLETION_CODE_MD5_ERROR, payFor, "MD5 signature is invalid.",
                    generateCheckMD5(payFor, orderAmount, orderCurrency, COMPLETION_CODE_MD5_ERROR, MERCHANT_API_IN_KEY));
        var lSubscriberId = parseInt(payFor);
        if (isNaN(lSubscriberId) || !paymentsUtils.isSubscriberExist(lSubscriberId))
            return prepareCheckResponse(COMPLETION_CODE_NOT_ALLOWED, payFor, "Subscriber doesn't exist",
                    generateCheckMD5(payFor, orderAmount, orderCurrency, COMPLETION_CODE_NOT_ALLOWED, MERCHANT_API_IN_KEY));
        if (paymentsUtils.isJuridicalPerson(lSubscriberId))
            return prepareCheckResponse(COMPLETION_CODE_NOT_ALLOWED, payFor, "Subscriber shouldn't be a juridical person.",
                    generateCheckMD5(payFor, orderAmount, orderCurrency, COMPLETION_CODE_NOT_ALLOWED, MERCHANT_API_IN_KEY));        
        return prepareCheckResponse(COMPLETION_CODE_OK, payFor, "OK",
                generateCheckMD5(payFor, orderAmount, orderCurrency, COMPLETION_CODE_OK, MERCHANT_API_IN_KEY));
    }

    /**
     * Выполняет зачисление средств на счет абонента <i>payFor</i> платёжа (с идентификатором <i>payId</i>
     *  в агрегаторе OnPay.ru) на сумму <i>orderAmount</i> и возвращает Xml-ответ об принятии платежа.
     * @param payId Идентификатор платежа в системе приёма платежей OnPay.ru
     * @param payFor Идентификатор абонента, для которого производится платеж
     * @param orderAmount Сумма платежа
     * @param orderCurrency Валюта
     * @param balanceAmount Сумма, которая будет внесена на баланс
     * @param balanceCurrency Валюта, в которой сумма платежа будет зачислена на баланс Мерчанта
     * @param exchangeRate Курс обмена, по которому сумма заказа (“order_amount”) была конвертирована в сумму к получению (“balance_amount”)
     * @param paymentDate Дата и время, в которое платёж был получен системой OnPay
     * @param md5 Хэш подпись платежа. Строка в верхнем регистре
     * @return {String} Строка, содержащая XML-ответ для OnPay.ru об успешной обработке платежа.
     */
    function pay(payId, payFor, orderAmount, orderCurrency, balanceAmount, balanceCurrency, exchangeRate, paymentDate, md5) {
        if (generatePayMD5(payFor, payId, null, orderAmount, orderCurrency, null, MERCHANT_API_IN_KEY) !== md5)
            return preparePayResponse(COMPLETION_CODE_MD5_ERROR, payFor, "MD5 signature is invalid.",
                    generatePayMD5(payFor, payId, '', orderAmount, orderCurrency, COMPLETION_CODE_MD5_ERROR, MERCHANT_API_IN_KEY));

        var operId = paymentsUtils.findOperationByPayment(payFor, model.dsSettings.cursor.pay_src_onpayru, payId);
        if (operId !== null)
            return preparePayResponse(COMPLETION_CODE_OK, "OK (existing transaction)", payId, payFor, operId,
                    generatePayMD5(payFor, payId, operId, orderAmount, orderCurrency, COMPLETION_CODE_OK, MERCHANT_API_IN_KEY));
        operId = subscriberAccountUtils.topUp({
            subscriber: payFor,
            sum: orderAmount,
            comment: "Пополнение счета",
            paymentSystem: model.dsSettings.cursor.pay_src_onpayru,
            paymentId: payId,
            paymentDate: paymentDate
        });
        if (operId !== null) // если платежная операция создана
            return preparePayResponse(COMPLETION_CODE_OK, "OK", payId, payFor, operId,
                    generatePayMD5(payFor, payId, operId, orderAmount, orderCurrency, COMPLETION_CODE_OK, MERCHANT_API_IN_KEY));
        else
            return preparePayResponse(COMPLETION_CODE_TIME_ERROR, "System in maintenance mode", payId, payFor, operId,
                    generatePayMD5(payFor, payId, operId, orderAmount, orderCurrency, COMPLETION_CODE_TIME_ERROR, MERCHANT_API_IN_KEY));
    }

    /**
     * Подготавливает check-ответ для агрегатора платежей OnPay.ru.
     *
     * Пример ответа, если проверка пройдена успешно:
     * <?xml version="1.0" encoding="UTF-8"?>
     * <result>
     * <code>0</code>
     * <pay_for>123456</pay_for>
     * <comment>OK</comment>
     * <md5>*</md5>
     * </result>
     *
     *  Пример ответа об ошибке обработки:
     * <?xml version="1.0" encoding="UTF-8"?>
     * <result>
     * <code>2</code>
     * <pay_for>123456</pay_for>
     * <comment>User account doesn’t exist</comment>
     * <md5>*</md5>
     * </result>
     *
     * @param code
     * @param pay_for
     * @param comment
     * @param md5
     * @return {String} Строка, содержащая Xml-структуру.
     */
    function prepareCheckResponse(code, pay_for, comment, md5) {
        var response = '<?xml version="1.0" encoding="UTF-8"?>' +
                '<result>' +
                '<code>' + code + '</code>' +
                '<pay_for>' + pay_for + '</pay_for>' +
                '<comment>' + comment + '</comment>' +
                '<md5>' + md5 + '</md5>' +
                '</result>';

        return response;
    }

    /**
     * Подготавливает <i>pay</i>-ответ для агрегатора платежей OnPay.ru.
     
     * Пример ответа:
     *  <?xml version="1.0" encoding="UTF-8"?>
     *  <result>
     *  <code>0</code>
     *  <comment>OK</comment>
     *  <onpay_id>12345</onpay_id>
     *  <pay_for>123456</pay_for>
     *  <order_id>98765</order_id>
     *  <md5>*</md5>
     *  </result>
     *
     * @param code
     * @param comment
     * @param onpay_id
     * @param pay_for
     * @param order_id
     * @param md5
     * @return {String} Строка, содержащая Xml-структуру.
     */
    function preparePayResponse(code, comment, onpay_id, pay_for, order_id, md5) {
        var response = '<?xml version="1.0" encoding="UTF-8"?>' +
                '<result>' +
                '<code>' + code + '</code>' +
                '<comment>' + comment + '</comment>' +
                '<onpay_id>' + onpay_id + '</onpay_id>' +
                '<pay_for>' + pay_for + '</pay_for>' +
                '<order_id>' + order_id + '</order_id>' +
                '<md5>' + md5 + '</md5>' +
                '</result>';
        return response;
    }

    /**
     * Генерирует MD5-хэш (в врехнем регистре) для <i>check</i> запросов/ответов.
     *  Шаблон для запроса (OnPay.ru -> наш сервис)
     *      "check;pay_for;order_amount;order_currency;merchant_api_in_key"
     *  Шаблон для ответа (наш сервис -> OnPay.ru):
     *      "check;pay_for;order_amount;order_currency;code;merchant_api_in_key"
     *  @param pay_for
     *  @param order_amount
     *  @param order_currency
     *  @param code
     *  @param merchant_api_in_key
     *  @return {String} MD5-хэш в вернем регистре.
     */
    function generateCheckMD5(pay_for, order_amount, order_currency, code, merchant_api_in_key) {
        var s = "check;" + pay_for + ";" + order_amount + ";" + order_currency + ";";
        if (code !== null)
            s += code + ";"
        s += MERCHANT_API_IN_KEY;
        return MD5Generator.generate(s).toUpperCase();
    }

    /**
     * Генерирует MD5-хэш для <i>pay</i> запросов/ответов.
     * Шаблон для запроса (OnPay.ru -> наш сервис)
     *      "pay;pay_for;onpay_id;order_amount;order_currency;merchant_api_in_key"
     *  Шаблон для ответа (наш сервис -> OnPay.ru):
     *      "pay;pay_for;onpay_id;merchant_order_id;order_amount;order_currency;code;merchant_api_in_key"
     *  @param pay_for
     *  @param onpay_id
     *  @param merchant_order_id Может быть <i>null</i>
     *  @param order_amount
     *  @param order_currency
     *  @param code Может быть <i>null</i>
     *  @param merchant_api_in_key
     *  @return {String} MD5-хэш.
     */
    function generatePayMD5(pay_for, onpay_id, merchant_order_id, order_amount, order_currency, code, merchant_api_in_key) {
        var s = "pay;" + pay_for + ";" + onpay_id + ";";
        if (merchant_order_id != null)
            s += merchant_order_id + ";";
        s += order_amount + ";" + order_currency + ";";
        if (code != null)
            s += code + ";"
        s += MERCHANT_API_IN_KEY;
        var hash = MD5Generator.generate(s)
        if (!code) { // для pay-ответа MD5-хэш передается в верхнем регистре
            return hash.toUpperCase();
        }
        return hash;
    }

}