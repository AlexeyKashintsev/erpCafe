/**
 * 
 * @author minya92
 */
function HistoryOperations() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    self.account_id = 0;
    
    self.setAccountId = function(anAccountId){
        self.account_id = anAccountId;
    };
    

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        model.qBillOperationsList.params.account_id = self.account_id;
        model.qBillOperationsList.params.status = model.params.op_status;
        model.requery();
    }//GEN-LAST:event_btnSelectActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        model.qBillOperationsList.params.account_id = self.account_id;
        model.requery();
    }//GEN-LAST:event_formWindowOpened
    
    self.show = function() {
        form.show();
    };
}
