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
        if (clientModule.checkIfPhoneExist(form.tfPhone.text)){
            self.tradeSession.setClientPhone(form.tfPhone.text);
            form.close();
        } else if (clientReg.phoneField.text == ""){
            self.tradeSession.setClientPhone(null);
            form.close();
        } else {
            clientReg.phoneField.text = form.tfPhone.text;
            clientReg.showModal(function(aResult){
                self.tradeSession.setClientPhone(aResult);
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

    function btnAnonimActionActionPerformed(evt) {//GEN-FIRST:event_btnAnonimActionActionPerformed
        self.tradeSession.setClientPhone("79206738064");
        form.close();
    }//GEN-LAST:event_btnAnonimActionActionPerformed
}
