/**
 * 
 * @author stipjey
 */
function SetUserPhoneForm() {
    var self = this, model = this.model, form = this;
    var tradeSession = new TradeSessions();
    var clientModule = new ClientServerModule();
    var clientReg = new ClientRegistrationByBarist();
    // TODO : place your code here

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        if (clientModule.checkIfPhoneExist(form.tfPhone.text)){
            tradeSession.setClientPhone(form.tfPhone.text);
        } else clientReg.showModal(function(aResult){
            tradeSession.setClientPhone(aResult);
        });
       form.close();
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
