/**
 * @public
 * @author minya92
 * @module
 */ 
function YandexPaymentReceiver() {
    var self = this, model = this.model;
    var bm = Session.get("BillModule");
    var af = new AdminFunctions();
    
    //Варианты ответа для яндекс денег
    self.RESPONSE_SUCCESS       = 0;   //Все хорошо
    self.RESPONSE_FAIL_HASH     = 1;   //Несовпали хэши
    self.RESPONSE_FAIL          = 200; //Ошибка разбора
    
    self.SHOP_PASSWORD = "";           //Секретное слово TODO Расхардкодить!
    
    /*
     * TODO Сделать как надо!
     */
    function sendToYandex(performedDatetime, code, shopId, invoiceId, orderSumAmount, message){
        var xmlhttp = getXmlHttp();
        xmlhttp.open('POST', 'http://money.yandex.ru/eshop.xml', true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) {
                    alert(xmlhttp.responseText);
                }
            }
        };
        xmlhttp.send(null);
    }
    
    /*
     * Проверка заказа 
     * Запрос проверки корректности параметров заказа. 
     * Этот шаг позволяет исключить ошибки, которые могли возникнуть при 
     * прохождении платежной формы через браузер плательщика.
     * В случае успешного ответа Контрагента Оператор предлагает плательщику оплатить 
     * заказ и при успехе отправляет Контрагенту «Уведомление о переводе».
     */
     self.сheckOrder = function(){
        var r = self.http.request.params;
        var hash = af.MD5(r.action + ";" + r.orderSumAmount + ";" + r.orderSumCurrencyPaycash + ";" +
                          r.orderSumBankPaycash + ";" + r.shopId + ";" + r.invoiceId + ";" +
                          r.customerNumber + ";" +self.SHOP_PASSWORD);
        if(hash === r.md5){
            //TODO Перечислить денюжки франчайзе
            sendToYandex(new Date(), self.RESPONSE_SUCCESS, r.shopId, r.invoiceId, r.orderSumAmount);
        } else {
            sendToYandex(new Date(), self.RESPONSE_FAIL_HASH, r.shopId, r.invoiceId, r.orderSumAmount);
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
    };
}
