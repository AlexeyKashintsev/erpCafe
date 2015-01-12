/**
 * @public
 * @author minya92
 * @module
 */ 
function YandexPaymentReceiverTest() {
    var self = this, model = this.model;
    var bm = Session.get("BillModule");
    var af = new AdminFunctions();
    
    //Варианты ответа для яндекс денег
    self.RESPONSE_SUCCESS       = 0;   //Все хорошо
    self.RESPONSE_FAIL_HASH     = 1;   //Несовпали хэши
    self.RESPONSE_FAIL          = 200; //Ошибка разбора
    
    self.SHOP_PASSWORD = "";           //Секретное слово TODO Расхардкодить!
    
    /*
     * Преобразование числа к двухзначному виду
     */
    function two(num) {
        return (num > 9 ? num : "0" + num);
    }
    /*
     * Формирует ответный XML файл для яндекса
     */
    function xmlToYandex(code, shopId, invoiceId, orderSumAmount, message){
        var d = new Date();
        var date = d.getFullYear() + "-" + two(d.getMonth()) + "-" + two(d.getDay()) + "T" +
                two(d.getHours()) + ":" + two(d.getMinutes()) + ":" + two(d.getSeconds())+"Z";
        return '<?xml version="1.0" encoding="UTF-8"?> <checkOrderResponse performedDatetime="'+
                date+'" code="'+code+'" invoiceId="'+invoiceId+'" orderSumAmount="'+
                orderSumAmount+'" shopId="'+shopId+'" message="'+message+'" />';
    }
    
    /*
     * Проверка заказа 
     * Запрос проверки корректности параметров заказа. 
     * Этот шаг позволяет исключить ошибки, которые могли возникнуть при 
     * прохождении платежной формы через браузер плательщика.
     * В случае успешного ответа Контрагента Оператор предлагает плательщику оплатить 
     * заказ и при успехе отправляет Контрагенту «Уведомление о переводе».
     */
     self.checkOrder = function(){
        var r = self.http.request.params;
        var hash = af.MD5(r.action + ";" + r.orderSumAmount + ";" + r.orderSumCurrencyPaycash + ";" +
                          r.orderSumBankPaycash + ";" + r.shopId + ";" + r.invoiceId + ";" +
                          r.customerNumber + ";" +self.SHOP_PASSWORD);
        if(hash === r.md5){
            if(r.billAccountId && r.billOperationId){
                model.qBillOperationsListServer.params.operation_id = r.billOperationId;
                model.qBillOperationsListServer.params.account_id = r.billAccountId;
                model.qBillOperationsListServer.requery();
                if(!model.qBillOperationsListServer.empty){
                    bm.setStatusBillOperation();
                }
                return xmlToYandex(self.RESPONSE_SUCCESS, r.shopId, r.invoiceId, r.orderSumAmount);
            }
        } else {
            return xmlToYandex(self.RESPONSE_FAIL_HASH, r.shopId, r.invoiceId, r.orderSumAmount, false);
        }
    };
    
    /*
     * Уведомление о переводе 
     * Уведомление Контрагента о принятом переводе. Этот запрос обозначает факт успешного 
     * перевода денежных средств плательщика в адрес Контрагента и обязанность Контрагента выдать товар плательщику.
     * Обратите внимание: на этом шаге Контрагент не может отказаться от приема перевода.
     */
    self.paymentAviso = function(){
        var r = self.http.request.params;
        var hash = af.MD5(r.action + ";" + r.orderSumAmount + ";" + r.orderSumCurrencyPaycash + ";" +
                          r.orderSumBankPaycash + ";" + r.shopId + ";" + r.invoiceId + ";" +
                          r.customerNumber + ";" +self.SHOP_PASSWORD);
        if(hash === r.md5){
            //TODO Вот тут перечислить денюжки франчайзе
            return xmlToYandex(self.RESPONSE_SUCCESS, r.shopId, r.invoiceId, r.orderSumAmount);
        } else {
            return xmlToYandex(self.RESPONSE_FAIL_HASH, r.shopId, r.invoiceId, r.orderSumAmount, false);
        }
    };
}
