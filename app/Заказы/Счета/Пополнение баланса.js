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

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if(anAccountId){
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
}
