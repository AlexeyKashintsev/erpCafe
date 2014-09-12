/**
 * 
 * @author minya92
 */
function ListBillAndServices() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var billModule = new P.ServerModule("BillModule");
    var createBillAccount = new CreateBillAccount();
    var addServiceForm = new AddServiceForm();
    var createServiceForm = new CreateServiceForm();
    var addBillOperation = new AddBillOperation();
    var historyOperations = new HistoryOperations();
    var billMeasures = new BillMeasures();
    var billItems = new BillItems();
    var billBuyItems = new BillBuyItems();
    
    self.FranchaziId = null;
    self.setFranchaziId = function(aFranchaziId){
        self.FranchaziId = aFranchaziId;
    }; 
    
    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.franchazi_id = self.FranchaziId;
        model.requery();
    };//GEN-LAST:event_formWindowOpened

    form.btnCreateBill.onActionPerformed = function(evt) {//GEN-FIRST:event_btnCreateBillActionPerformed
        createBillAccount.setFranchaziId(self.FranchaziId);
        createBillAccount.show(function(aResult){
            if(aResult) model.qBillAccount.requery();
        });
    };//GEN-LAST:event_btnCreateBillActionPerformed

    form.btnAddService.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddServiceActionPerformed
        addServiceForm.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addServiceForm.show(function(aResult){        
        });
        model.qBillAccount.requery();
    };//GEN-LAST:event_btnAddServiceActionPerformed

    model.qBillAccount.onScrolled = function(evt) {//GEN-FIRST:event_qBillAccountOnScrolled
        if(model.qBillAccount.length > 0)
            model.params.account_id = model.qBillAccount.cursor.bill_accounts_id;
         else 
            model.params.account_id = null;
        model.qServiceListByAccount.requery();
    };//GEN-LAST:event_qBillAccountOnScrolled

    model.qBillAccount.onRequeried = function(evt) {//GEN-FIRST:event_qBillAccountOnRequeried
        if(model.qBillAccount.length > 0)
            model.params.account_id = model.qBillAccount.cursor.bill_accounts_id;
         else 
            model.params.account_id = null;
        model.qServiceListByAccount.requery();
    };//GEN-LAST:event_qBillAccountOnRequeried

    form.btnOperations.onActionPerformed = function(evt) {//GEN-FIRST:event_btnOperationsActionPerformed
        historyOperations.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        historyOperations.show();
    };//GEN-LAST:event_btnOperationsActionPerformed

    form.button4.onActionPerformed = function(evt) {//GEN-FIRST:event_button4ActionPerformed
        billModule.delServiceFromAccount(model.qServiceListByAccount.cursor.account_id, model.qServiceListByAccount.cursor.bill_services_id);
    };//GEN-LAST:event_button4ActionPerformed

    form.btnBuyItems.onActionPerformed = function(evt) {//GEN-FIRST:event_btnBuyItemsActionPerformed
        billBuyItems.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        billBuyItems.show();
    };//GEN-LAST:event_btnBuyItemsActionPerformed

    form.btnCreateService.onActionPerformed = function(evt) {//GEN-FIRST:event_btnCreateServiceActionPerformed
        createServiceForm.show();
    };//GEN-LAST:event_btnCreateServiceActionPerformed

    form.btnAddOperation.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddOperationActionPerformed
        addBillOperation.setAccountId(model.qBillAccount.cursor.bill_accounts_id);
        addBillOperation.show();
        model.qBillAccount.requery();
    };//GEN-LAST:event_btnAddOperationActionPerformed

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        billItems.show();
    };//GEN-LAST:event_buttonActionPerformed

    form.btnBillMeasures.onActionPerformed = function(evt) {//GEN-FIRST:event_btnBillMeasuresActionPerformed
        billMeasures.show();
    };//GEN-LAST:event_btnBillMeasuresActionPerformed
}
