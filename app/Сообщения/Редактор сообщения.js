/**
 * 
 * @author StipJey
 */
function editMessageForm() {
    var self = this, model = this.model, form = this;
    var SMSType = null;
    
    self.setSmsType = function(aSmsType){
       SMSType = aSmsType;
       model.params.event = SMSType;
       model.qGetTagsForEvent.requery(function(){
            model.qGetTagsForEvent.beforeFirst();
            while (model.qGetTagsForEvent.next()){
                var btn = new Button(model.qGetTagsForEvent.cursor.tag_description);
                btn.tag = model.qGetTagsForEvent.cursor.tag;
                btn.onActionPerformed = function(evt) {
                    model.qGetSendParams.cursor.message += "%" + this.tag + "%";
                };
                self.panel.add(btn);
            }
        });
    };

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

    }//GEN-LAST:event_formWindowOpened

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        form.close(model.qGetSendParams.cursor.message);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);
    }//GEN-LAST:event_btnCancelActionPerformed

    



    function formWindowClosed(evt) {//GEN-FIRST:event_formWindowClosed
        
    }//GEN-LAST:event_formWindowClosed
}
