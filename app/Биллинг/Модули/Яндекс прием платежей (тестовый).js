/**
 * @public
 * @author minya92
 * @module
 */ 
function YandexPaymentReceiverTest() {
    var self = this, model = this.model;
    var bm = Session.getModule("BillModule");
    var ep = Session.getModule("EventProcessor");
    var settings = Session.getModule("Settings");
    var af = new AdminFunctions();
    
    //Варианты ответа для яндекс денег
    self.RESPONSE_SUCCESS       = 0;   //Все хорошо
    self.RESPONSE_FAIL_HASH     = 1;   //Несовпали хэши
    self.RESPONSE_FAIL          = 200; //Ошибка разбора
    
    var SHOP_PASSWORD = settings.getSettingByName("shopPassword").pass;
    
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
        Logger.info("checkOrderTest");
        var r = self.http.request.params;
        var hash = af.MD5(r.action + ";" + r.orderSumAmount + ";" + r.orderSumCurrencyPaycash + ";" +
                          r.orderSumBankPaycash + ";" + r.shopId + ";" + r.invoiceId + ";" +
                          r.customerNumber + ";" +SHOP_PASSWORD);
        if(hash.toUpperCase() === r.md5.toUpperCase()){
            ep.addEvent("checkOrderSuccess",{
                billOperation   :   r.billOperation,
                orderSumAmount  :   r.orderSumAmount,
                customerNumber  :   r.customerNumber
            });
            return xmlToYandex(self.RESPONSE_SUCCESS, r.shopId, r.invoiceId, r.requestDatetime);
        } 
        ep.addEvent("checkOrderError",{
            billOperation   :   r.billOperation,
            orderSumAmount  :   r.orderSumAmount,
            customerNumber  :   r.customerNumber
        });
        return xmlToYandex(self.RESPONSE_FAIL_HASH, r.shopId, r.invoiceId, r.requestDatetime);
    };
    
    /*
     * Уведомление о переводе 
     * Уведомление Контрагента о принятом переводе. Этот запрос обозначает факт успешного 
     * перевода денежных средств плательщика в адрес Контрагента и обязанность Контрагента выдать товар плательщику.
     * Обратите внимание: на этом шаге Контрагент не может отказаться от приема перевода.
     */
    self.paymentAviso = function(){
        Logger.info("paymentAvisoTest");
        var r = self.http.request.params;
        var hash = af.MD5(r.action + ";" + r.orderSumAmount + ";" + r.orderSumCurrencyPaycash + ";" +
                          r.orderSumBankPaycash + ";" + r.shopId + ";" + r.invoiceId + ";" +
                          r.customerNumber + ";" +SHOP_PASSWORD);
        if(hash.toUpperCase() === r.md5.toUpperCase()){
           if(r.billOperation){
                model.qBillOperationsListServer.params.operation_id = r.billOperation;
                model.qBillOperationsListServer.requery();
                if(!model.qBillOperationsListServer.empty){
                    if(bm.setStatusBillOperation(r.billOperation, bm.OP_STATUS_SUCCESS, SHOP_PASSWORD)){
                        Logger.info("BILL STATUS CHANGED!");
                        ep.addEvent("paymentAvisoSuccess",{
                            billOperation   :   r.billOperation,
                            orderSumAmount  :   r.orderSumAmount,
                            customerNumber  :   r.customerNumber
                        });
                        return xmlToYandex(self.RESPONSE_SUCCESS, r.shopId, r.invoiceId, r.requestDatetime);
                    }
                }
            }
        }
        ep.addEvent("paymentAvisoError",{
            billOperation   :   r.billOperation,
            orderSumAmount  :   r.orderSumAmount,
            customerNumber  :   r.customerNumber
        });
        return xmlToYandex(self.RESPONSE_FAIL_HASH, r.shopId, r.invoiceId, r.requestDatetime);
    };
}
