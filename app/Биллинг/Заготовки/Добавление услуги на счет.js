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
        form.close(billModule.AddService(self.accountId, model.params.service_id));
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.requery();
    }//GEN-LAST:event_formWindowOpened
}
