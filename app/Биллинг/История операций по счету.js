/**
 * 
 * @author minya92
 */
function HistoryOperations() {
    var self = this, model = this.model, form = this;
    
    self.account_id = 0;
    
    self.setAccountId = function(anAccountId){
        self.account_id = anAccountId;
    };
    

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        model.qBillOperationsList.params.account_id = self.account_id;
        model.qBillOperationsList.params.status = model.params.op_status;
        model.requery();
    }//GEN-LAST:event_btnSelectActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qBillOperationsList.params.account_id = self.account_id;
        model.requery();
    }//GEN-LAST:event_formWindowOpened
}
