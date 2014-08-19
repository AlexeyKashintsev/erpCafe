/**
 * 
 * @author minya92
 */
function ListBillAndServices() {
    var self = this, model = this.model, form = this;
    var billModule = new ServerModule("BillModule");
    var billServerModule = new ServerModule("BillServerModule");
    var createBillAccount = new CreateBillAccount();
    var addServiceForm = new AddServiceForm();
    var createServiceForm = new CreateServiceForm();
    var addBillOperation = new AddBillOperation();
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

    function btnCronActionPerformed(evt) {//GEN-FIRST:event_btnCronActionPerformed
        billServerModule.paymentForServices();
    }//GEN-LAST:event_btnCronActionPerformed

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
}
