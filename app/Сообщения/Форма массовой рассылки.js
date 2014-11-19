/**
 * 
 * @author Work
 */
function msgMassSendForm() {
    var self = this, model = this.model, form = this;
    var Sender = new ServerModule("MessageSender");
    var Editor = new editMessageForm();
    var eventType = 150;
    Editor.setSmsType(eventType);
    model.qGetSendParams.params.eventType = eventType;
    model.params.city = 150;
    function CheckUserType(){
        if (form.rbFran.selected){
            return "franchazi";
        }
        if (form.rbBar.selected){
            return "barista";
        }
        if (form.rbClient.selected){
            return "client";
        }
        if (form.rbAll.selected){
            return "all";
        }
    }
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var userType = CheckUserType();
        var text = form.modelTextArea.value;
        //TODO Добавить город
        var city_id = model.params.city;
        Sender.massSending(text, userType, city_id);
    }//GEN-LAST:event_buttonActionPerformed

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        form.close();   
    }//GEN-LAST:event_button1ActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened

    function modelTextAreaMouseClicked(evt) {//GEN-FIRST:event_modelTextAreaMouseClicked
        Editor.showModal(function(){
            model.qGetSendParams.requery();
        });
    }//GEN-LAST:event_modelTextAreaMouseClicked
}
