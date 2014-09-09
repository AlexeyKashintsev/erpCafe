/**
 * 
 * @author stipjey
 */
function clientEditPersonalInfo() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close();
    };//GEN-LAST:event_btnSaveActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        model.qPersonalData.params.user_name = self.principal.name;
        model.qPersonalData.requery();
    };//GEN-LAST:event_formWindowOpened
    
    self.show = function() {
        form.show();
    };
}
