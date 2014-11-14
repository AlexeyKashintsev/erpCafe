/**
 * 
 * @author minya92
 * 
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
        if(form.rbAdd.selected) operation = "OPERATION_ADD_CASH";
        else operation = "OPERATION_DEL_BUY";
        billModule.addBillOperation(self.account_id, billModule.getSelfPropertyValue(operation), form.tfSum.text, billModule.getSelfPropertyValue("OP_STATUS_SUCCESS"));
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed
}
