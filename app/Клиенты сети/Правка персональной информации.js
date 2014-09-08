/**
 * 
 * @author stipjey
 */
function clientEditPersonalInfo() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close();
    }//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qPersonalData.params.user_name = self.principal.name;
        model.qPersonalData.requery();
    }//GEN-LAST:event_formWindowOpened
}
