/**
 * 
 * @author minya92
 */
function AddServiceForm() {
    var self = this, model = this.model, form = this;
    var billModule = new ServerModule("BillModule");
    model.params.service_id = null;
    
    self.accountId = null;
    self.setAccountId = function(anAccountId){
        self.accountId = anAccountId;
    }; 

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        billModule.AddService(self.accountId, model.params.service_id);
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed
}
