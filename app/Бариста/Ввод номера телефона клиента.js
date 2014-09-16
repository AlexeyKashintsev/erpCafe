/**
 * 
 * @author stipjey
 */
function SetUserPhoneForm() {
    var self = this, model = this.model, form = this;
    self.tradeSession = null;
    var clientModule = new ClientServerModule();
    var clientReg = new ClientRegistrationByBarist();
    // TODO : place your code here

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if (form.tfPhone.text === ""){
            self.tradeSession.setClientPhone(null);
            form.close();
        } else if (clientModule.checkIfPhoneExist(form.tfPhone.text)){
            self.tradeSession.setClient(form.tfPhone.text);
            form.close();
        } else {
            clientReg.phoneField.text = form.tfPhone.text;
            clientReg.showModal(function(aPhone){
                self.tradeSession.setClient(aPhone);
                form.close();
            });
        }
    }//GEN-LAST:event_buttonActionPerformed

    function tfPhoneKeyReleased(evt) {//GEN-FIRST:event_tfPhoneKeyReleased
         if (clientModule.checkIfPhoneExist(form.tfPhone.text)){
             form.label.visible = false;
             form.button.text = "Подтвердить";
         } else {
             form.label.visible = true;
             form.button.text = "Зарегистрировать";
         }
    }//GEN-LAST:event_tfPhoneKeyReleased
}
