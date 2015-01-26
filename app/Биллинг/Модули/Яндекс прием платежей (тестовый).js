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
    
    self.SHOP_PASSWORD = "Yw559fyo3yBDFNy708rK";           //Секретное слово TODO Расхардкодить!
    
    /*
     * Формирует ответный XML файл для яндекса
     */
    function xmlToYandex(code, shopId, invoiceId, aDate){
        return '<?xml version="1.0" encoding="UTF-8"?> \n\
                <checkOrderResponse performedDatetime="'+
                aDate+'" code="'+code+'" invoiceId="'+invoiceId+'" shopId="'+shopId+'"/>';
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
        if(hash.toUpperCase() === r.md5.toUpperCase()){
            return xmlToYandex(self.RESPONSE_SUCCESS, r.shopId, r.invoiceId, r.requestDatetime);
        } 
        return xmlToYandex(self.RESPONSE_FAIL_HASH, r.shopId, r.invoiceId, r.requestDatetime);
        
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
        if(hash.toUpperCase() === r.md5.toUpperCase()){
           if(r.billOperation){
                model.qBillOperationsListServer.params.operation_id = r.billOperation;
                model.qBillOperationsListServer.requery();
                if(!model.qBillOperationsListServer.empty){
                    bm.setStatusBillOperation(r.billOperation, bm.OP_STATUS_SUCCESS);
                    Logger.info("BILL STATUS CHANGED!");
                }
                return xmlToYandex(self.RESPONSE_SUCCESS, r.shopId, r.invoiceId, r.requestDatetime);
            }
        }
        return xmlToYandex(self.RESPONSE_FAIL_HASH, r.shopId, r.invoiceId, r.requestDatetime);
        
    };
}
