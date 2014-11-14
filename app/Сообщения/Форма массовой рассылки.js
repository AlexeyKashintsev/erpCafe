/**
 * 
 * @author Work
 */
function msgMassSendForm() {
    var self = this, model = this.model, form = this;
    var Sender = new ServerModule("MessageSender");
    // TODO : place your code here

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
        var text = form.textArea.text;
        //TODO Добавить город
        var city_id = null;
        Sender.massSending(text, userType, city_id);
    }//GEN-LAST:event_buttonActionPerformed

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        form.close();   
    }//GEN-LAST:event_button1ActionPerformed
}
