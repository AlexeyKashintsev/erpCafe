/**
 * 
 * @author minya92
 */
function ListBillAndServices() {
    var self = this, model = this.model, form = this;
    var billModule = new ServerModule("BillModule");
    var createBillAccount = new CreateBillAccount();
    var addServiceForm = new AddServiceForm();
    var createServiceForm = new CreateServiceForm();
    var addBillOperation = new AddBillOperation();
    var historyOperations = new HistoryOperations();
    var addBalanceForm = new AddBalanceForm();
    self.FranchaziId = null;
    self.setFranchaziId = function(aFranchaziId){
        self.FranchaziId = aFranchaziId;
    }; 
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.franchazi_id = self.FranchaziId;
        model.requery();
    }//GEN-LAST:event_formWindowOpened

    function btnCreateBillActionPerformed(evt) {//GEN-FIRST:event_btnCreateBillActionPerformed
        createBillAccount.setFranchaziId(self.FranchaziId);
        createBillAccount.showModal(function(aResult){
            if(aResult) model.qBillAccount.requery();
        });
    }//GEN-LAST:event_btnCreateBillActionPerformed

    function btnAddServiceActionPerformed(evt) {//GEN-FIRST:event_btnAddServiceActionPerformed
        addServiceForm.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addServiceForm.showModal(function(aResult){        
        });
        model.qBillAccount.requery();
    }//GEN-LAST:event_btnAddServiceActionPerformed

    function qBillAccountOnScrolled(evt) {//GEN-FIRST:event_qBillAccountOnScrolled
        if(model.qBillAccount.length > 0)
            model.params.account_id = model.qBillAccount.cursor.bill_accounts_id;
         else 
            model.params.account_id = null;
        model.qServiceListByAccount.requery();
    }//GEN-LAST:event_qBillAccountOnScrolled

    function qBillAccountOnRequeried(evt) {//GEN-FIRST:event_qBillAccountOnRequeried
        if(model.qBillAccount.length > 0)
            model.params.account_id = model.qBillAccount.cursor.bill_accounts_id;
         else 
            model.params.account_id = null;
        model.qServiceListByAccount.requery();
    }//GEN-LAST:event_qBillAccountOnRequeried

    function btnOperationsActionPerformed(evt) {//GEN-FIRST:event_btnOperationsActionPerformed
        historyOperations.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        historyOperations.showModal();
    }//GEN-LAST:event_btnOperationsActionPerformed

    function button4ActionPerformed(evt) {//GEN-FIRST:event_button4ActionPerformed
        billModule.delServiceFromAccount(model.qServiceListByAccount.cursor.account_id, model.qServiceListByAccount.cursor.bill_services_id)
    }//GEN-LAST:event_button4ActionPerformed

    function btnAddOperationActionPerformed(evt) {//GEN-FIRST:event_btnAddOperationActionPerformed
        addBillOperation.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addBillOperation.showModal(function (aResult){
            if(aResult) model.qBillAccount.requery();
        });
    }//GEN-LAST:event_btnAddOperationActionPerformed

    function btnCreateServiceActionPerformed(evt) {//GEN-FIRST:event_btnCreateServiceActionPerformed
        createServiceForm.showModal();
    }//GEN-LAST:event_btnCreateServiceActionPerformed

    function btnAddBalanceActionPerformed(evt) {//GEN-FIRST:event_btnAddBalanceActionPerformed
        addBalanceForm.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addBalanceForm.showModal();
        model.qBillAccount.requery();
    }//GEN-LAST:event_btnAddBalanceActionPerformed
}
