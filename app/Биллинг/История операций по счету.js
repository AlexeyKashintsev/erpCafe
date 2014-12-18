/**
 * @public
 * @author minya92
 */
function HistoryOperations() {
    var self = this, model = this.model, form = this;
    
    self.account_id = 0;
    
    self.setAccountId = function(anAccountId){
        self.account_id = anAccountId;
    };
    

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.params.op_status = 0;
    }//GEN-LAST:event_formWindowOpened

    function paramsOnChanged(evt) {//GEN-FIRST:event_paramsOnChanged
        model.qBillOperationsList.params.account_id = self.account_id;
        model.qBillOperationsList.params.status = model.params.op_status;
        model.qBillOperationsList.execute();
    }//GEN-LAST:event_paramsOnChanged
}
