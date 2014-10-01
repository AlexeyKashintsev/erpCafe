/**
 * 
 * @author StipJey
 */
function editMessageForm() {
    var self = this, model = this.model, form = this;
    var SMSType = null;
    
    self.setSmsType = function(aSmsType){
       SMSType = aSmsType;
    };

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if (SMSType){
            model.qGetSendParams.params.eventType = SMSType;
            model.requery();
        } else {
            form.close("error");
        }
    }//GEN-LAST:event_formWindowOpened

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);
    }//GEN-LAST:event_btnCancelActionPerformed

    function btnAddUsernameActionPerformed(evt) {//GEN-FIRST:event_btnAddUsernameActionPerformed
        model.qGetSendParams.cursor.message += "%username%"; 
    }//GEN-LAST:event_btnAddUsernameActionPerformed

    function btnAddCountActionPerformed(evt) {//GEN-FIRST:event_btnAddCountActionPerformed
        model.qGetSendParams.cursor.message += "%count%"; 
    }//GEN-LAST:event_btnAddCountActionPerformed

    function btnAddPasswordActionPerformed(evt) {//GEN-FIRST:event_btnAddPasswordActionPerformed
        model.qGetSendParams.cursor.message += "%password%"; 
    }//GEN-LAST:event_btnAddPasswordActionPerformed




    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
    var btn = new Button("fhfghgh");
    form.panel.add(btn);
    }//GEN-LAST:event_buttonActionPerformed
}
