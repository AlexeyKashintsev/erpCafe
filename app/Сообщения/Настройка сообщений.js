/**
 * 
 * @name messngerSettings
 * @author Alexey
 */
function messengerSettings() {
    var self = this, model = this.model, form = this;
    var EditMessageForm = new editMessageForm();
    // TODO : place your code here

    function btnSaveMouseClicked(evt) {//GEN-FIRST:event_btnSaveMouseClicked
        self.model.save();
    }//GEN-LAST:event_btnSaveMouseClicked

    function btnExitActionPerformed(evt) {//GEN-FIRST:event_btnExitActionPerformed
        self.close();
    }//GEN-LAST:event_btnExitActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        if (evt.clickCount >=2 ){
            EditMessageForm.setSmsType(model.qGetSendParams.cursor.event_type);
            EditMessageForm.showModal(function(){
                model.requery();
            });
        }
    }//GEN-LAST:event_modelGridMouseClicked
}
