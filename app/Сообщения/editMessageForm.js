/**
 * 
 * @author StipJey
 */
function editMessageForm() {
    var self = this, model = this.model, form = this;
    var SMSType = null;
    
    self.setSmsType = function(aSmsType){
       SMSType = aSmsType;
    }

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if (SMSType){
            model.qGetSendParams.params.eventType = SMSType;
            model.requery();
        } else {
            //TODO добавить error
        }
    }//GEN-LAST:event_formWindowOpened

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);
    }//GEN-LAST:event_btnCancelActionPerformed
}
