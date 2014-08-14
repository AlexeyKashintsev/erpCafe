/**
 * 
 * @author minya92
 */
function AddBillOperation() {
    var self = this, model = this.model, form = this;
    var billModule = new ServerModule("BillModule");
    var createBillAccount = new CreateBillAccount();
    var addServiceForm = new AddServiceForm();
    self.FranchaziId = null;
    self.setFranchaziId = function(aFranchaziId){
        self.FranchaziId = aFranchaziId;
    }; 
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        //alert(model.qBillAccount.cursor.bill_accounts_id.toString());
        var operation;
        if(form.rbAdd.selected) operation = billModule.OPERATION_ADD;
        else operation = billModule.OPERATION_DEL;
        if(!billModule.addBillOperation(model.qBillAccount.cursor.bill_accounts_id,
                                        operation,
                                        form.tfSum.text,
                                        billModule.OP_STATUS_SUCCESS))
        {
            if(confirm("У вас недосточно средств на счете!\nСохранить заказ?")){
                billModule.addBillOperation(model.qBillAccount.cursor.bill_accounts_id,
                                        operation,
                                        form.tfSum.text,
                                        billModule.OP_STATUS_FAIL);
            }
        }
        model.requery();
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.franchazi_id = self.FranchaziId;
        model.requery();
    }//GEN-LAST:event_formWindowOpened

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        createBillAccount.setFranchaziId(self.FranchaziId);
        createBillAccount.showModal(function(aResult){
            if(aResult) model.qBillAccount.requery();
        });
    }//GEN-LAST:event_button1ActionPerformed

    function button2ActionPerformed(evt) {//GEN-FIRST:event_button2ActionPerformed
        addServiceForm.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addServiceForm.showModal(function(aResult){
            if(aResult) model.qServiceListByAccount.requery();
        });
    }//GEN-LAST:event_button2ActionPerformed

    function qBillAccountOnScrolled(evt) {//GEN-FIRST:event_qBillAccountOnScrolled
        model.params.account_id = model.qBillAccount.cursor.bill_accounts_id;
        model.qServiceListByAccount.requery();
    }//GEN-LAST:event_qBillAccountOnScrolled

    function qBillAccountOnRequeried(evt) {//GEN-FIRST:event_qBillAccountOnRequeried
        if(model.qBillAccount.length > 0){
            model.params.account_id = model.qBillAccount.cursor.bill_accounts_id;
            model.qServiceListByAccount.requery();
        }
    }//GEN-LAST:event_qBillAccountOnRequeried
}
