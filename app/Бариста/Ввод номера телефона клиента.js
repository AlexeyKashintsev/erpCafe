/**
 * 
 * @author stipjey
 */
function GetUserPhoneForm() {
    var self = this, model = this.model, form = this;
    self.tradeSession = null;
    var clientReg = new ClientRegistrationByBarist();

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if (form.tfPhone.text === ""){
            form.close();
        } else if (session.clientModule.checkIfPhoneExist(form.tfPhone.text)){
            form.close(form.tfPhone.text);
        } else {
            clientReg.phoneField.text = form.tfPhone.text;
            clientReg.showModal(function(aPhone){
                form.close(aPhone);
            });
        }
    }//GEN-LAST:event_buttonActionPerformed

    function tfPhoneKeyReleased(evt) {//GEN-FIRST:event_tfPhoneKeyReleased
         if (session.clientModule.checkIfPhoneExist(form.tfPhone.text)){
             form.label.visible = false;
             form.button.text = "Подтвердить";
         } else {
             form.label.visible = true;
             form.button.text = "Зарегистрировать";
         }
    }//GEN-LAST:event_tfPhoneKeyReleased
}
