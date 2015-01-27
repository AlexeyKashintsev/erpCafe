/**
 * 
 * @author minya92
 */
function AddBalance(anAccountId) {
    var self = this, model = this.model, form = this;
    var userSession = new ServerModule("UserSession");
    var billModule  = new ServerModule("BillModule");
    units.billApi = new ServerModule('BillApi');
    
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened

    function yandexSubmitOnClick(){
        var sum = $("#sum").val();
        var billOperation = billModule.addBillOperation(anAccountId, billModule.getSelfPropertyValue("OPERATION_ADD_CASH"), sum, billModule.getSelfPropertyValue("OP_YANDEX_CREATE"));
        if(billOperation){
            $("#billOperation").val(billOperation);
            $("#form").submit();
        } else
            alert("Не удалось провести операцию. Повторите запрос позже!");
    }
    
    function setPaymentYamoney(){
        $("#paymentType").val("PC");
    }
    
    function setPaymentTerminal(){
        $("#paymentType").val("GP");
    }
    
    function setPaymentCard(){
        $("#paymentType").val("AC");
    }

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if(anAccountId){
            if(form.rbYandex.selected){
                var modal = new cmn.Modal("Оплата через Яндекс.Деньги");
                var modalBody = modal.getModalBody();
                var yandexForm = cmn.createElement("div", "yandexForm", modalBody, "yandexForm");
                yandexForm.innerHTML =   
                        '<form role="form" id ="form" action="https://demomoney.yandex.ru/eshop.xml" method="post" target="_blank">\n\
                        <input name="shopId" value="20474" type="hidden"/>\n\
                        <input name="scid" value="58702" type="hidden"/>\n\
                        <input name="billOperation" id="billOperation" type="hidden">\n\
                        <input name="paymentType" id="paymentType" value="PC" type="hidden">\n\
                        <input name="shopSuccessURL" value="https://internal.rccoffee.ru/erpCafe/successURL.html" type="hidden">\n\
                        <input name="shopFailURL" value="https://internal.rccoffee.ru/erpCafe/failURL.html" type="hidden">\n\
                        <div class="form-group">\n\
                            <label for="sum">Сумма для пополнения</label>\n\
                            <input type="numeric" name="sum" class="form-control" id="sum" placeholder="Введите сумму" value="'+form.textField.text+'">\n\
                        </div>\n\
                         <div class="form-group">\n\
                            <label for="cps_phone">Номер телефона</label>\n\
                            <input type="number" name="cps_phone" class="form-control" id="cps_phone" placeholder="Введите телефон">\n\
                        </div>\n\
                        <div class="form-group">\n\
                            <label for="cps_email">Email</label>\n\
                            <input type="email" name="cps_email" class="form-control" id="cps_email" placeholder="Введите Email">\n\
                        </div>\n\
                        <div class="form-group">\n\
                            <label for="cps_email">Способ оплаты</label>\n\
                            <div class="radio" id="yaMoney">\n\
                                <label>\n\
                                    <input type="radio" name="radio" value="PC" checked>\n\
                                       Оплата с кошелька Яндекс.Денег\n\
                                </label>\n\
                            </div>\n\
                            <div class="radio" id="terminal">\n\
                                <label>\n\
                                    <input type="radio" name="radio" value="GP">\n\
                                       Оплата через терминал\n\
                                </label>\n\
                            </div>\n\
                            <div class="radio" id="card">\n\
                                <label>\n\
                                    <input type="radio" name="radio" value="AC">\n\
                                       Оплата банковской картой\n\
                                </label>\n\
                            </div>\n\
                        </div>\n\
                        <input name="customerNumber" value="abc000456" type="hidden"/>\n\
                        <!--button type="submit" class="btn btn-default">Оплатить</button-->\n\
                        </form>\n\
                        <button id="submit" class="btn btn-default">Оплатить</button>';
                document.getElementById('submit').onclick = yandexSubmitOnClick;
                document.getElementById('yaMoney').onclick = setPaymentYamoney;
                document.getElementById('terminal').onclick = setPaymentTerminal;
                document.getElementById('card').onclick = setPaymentCard;
                modal.show();
                form.close();
            }else{
                try {
                    model.listFranchazi.params.franchazi_id = userSession.getFranchazi();
                    model.requery(function(){
                        var aSum = form.textField.text * 1.0;
                        if(typeof aSum == "number" && aSum > 0){
                            var billCreator = new Report('DetailedBill');
                            var bd = units.billApi.getSupplierDetails();
                            var billItems = getItems(aSum);
                            bd.billDate = new Date();
                            bd.sum = aSum;
                            bd.itemsNo = billItems.length;
                            bd.consumerName =  model.listFranchazi.cursor.f_name;
                            bd.billNumber = model.billsCount.cnt;

                            billCreator.setDetails(bd, billItems);
                            billCreator.show();

                            billModule.addBillOperation(anAccountId, billModule.getSelfPropertyValue("OPERATION_ADD_CASH"), aSum, billModule.getSelfPropertyValue("OP_STATUS_BILL"));       
                            form.close(true);
                        } else 
                            alert("Некорректная сумма!");

                    });
                } catch (e) {
                    Logger.warning(e);
                    form.close(false);
                }
            }
        }
    }//GEN-LAST:event_buttonActionPerformed

     function getItems(aSum) {
        var res = [];
        res.push({
            num: (res.length + 1),
            itemName: "Пополнение лицевого счета №"+anAccountId,
            desc: "руб",
            count: "1",
            cost: aSum,
            sum: aSum
        });
        
        return res;
     }

    function rbYandexActionPerformed(evt) {//GEN-FIRST:event_rbYandexActionPerformed
       
    }//GEN-LAST:event_rbYandexActionPerformed
}
