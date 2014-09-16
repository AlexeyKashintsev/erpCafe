/**
 * 
 * @author stipjey
 */
function clientEditPersonalInfo() {
    var self = this, model = this.model, form = this;
    
    

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close();
    }//GEN-LAST:event_btnSaveActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qPersonalData.params.user_name = session.getUserName();
        model.qPersonalData.requery();
    }//GEN-LAST:event_formWindowOpened
}
