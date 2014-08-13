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
}
