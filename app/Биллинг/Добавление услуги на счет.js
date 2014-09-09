/**
 * 
 * @author minya92
 */
function AddServiceForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var billModule = new P.ServerModule("BillModule");
    model.params.service_id = null;
    
    self.accountId = null;
    self.setAccountId = function(anAccountId){
        self.accountId = anAccountId;
    }; 

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        form.close(billModule.AddService(self.accountId, model.params.service_id));
    }//GEN-LAST:event_buttonActionPerformed
    
    self.show = function() {
        form.show();
    };
}
