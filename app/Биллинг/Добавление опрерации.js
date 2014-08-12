/**
 * 
 * @author minya92
 */
function AddBillOperation() {
    var self = this, model = this.model, form = this;
    var billModule = new ServerModule("BillModule");
    var createBillAccount = new CreateBillAccount();
    self.FranchaziId = null;
    self.setFranchaziId = function(aFranchaziId){
        self.FranchaziId = aFranchaziId;
    }; 
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var operation;
        if(form.rbAdd.selected){
            operation = billModule.OPERATION_ADD;
        }else{
            operation = billModule.OPERATION_DEL;
        }
        billModule.addBillOperation(model.qAddBillAccount.cursor.bill_accounts_id,
                                    operation,
                                    form.tfSum.text,
                                    billModule.STATUS_SUCCESS);
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.franchazi_id = self.FranchaziId;
        model.requery();
    }//GEN-LAST:event_formWindowOpened

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        createBillAccount.setFranchaziId(self.FranchaziId);
        createBillAccount.showModal(function(aResult){
            if(aResult) model.qAddBillAccount.requery();
        });
    }//GEN-LAST:event_button1ActionPerformed
}
