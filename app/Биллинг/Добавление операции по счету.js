/**
 * 
 * @author minya92
 */
function AddBillOperation() {
    var self = this, model = this.model, form = this;
    var billModule = new ServerModule("BillModule");
    self.account_id = 0;
    self.setAccountId = function(anAccountId){
        self.account_id = anAccountId;
    };
    
    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        //alert(model.qBillAccount.cursor.bill_accounts_id.toString());
        var operation;
        if(form.rbAdd.selected) operation = billModule.OPERATION_ADD_CASH;
        else operation = billModule.OPERATION_DEL_BUY;
        if(!billModule.addBillOperation(self.account_id, operation, form.tfSum.text, billModule.OP_STATUS_SUCCESS))
        {
            if(confirm("У вас недосточно средств на счету!\nСохранить заказ?")){
                billModule.addBillOperation(self.account_id, operation, form.tfSum.text, billModule.OP_STATUS_FAIL);
            }
        }
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed
}
