/**
 * 
 * @author stipjey
 */
function SetUserPhoneForm() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    self.tradeSession = null;
    var clientModule = new ClientServerModule();
    var clientReg = new ClientRegistrationByBarist();
    // TODO : place your code here

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        if (form.tfPhone.text === ""){
            self.tradeSession.setClientPhone(null);
            form.close();
        } else if (clientModule.checkIfPhoneExist(form.tfPhone.text)){
            self.tradeSession.setClientPhone(form.tfPhone.text);
            form.close();
        } else {
            clientReg.phoneField.text = form.tfPhone.text;
            clientReg.showModal(function(aResult){
                self.tradeSession.setClientPhone(aResult);
                form.close();
            });
        }
    }//GEN-LAST:event_buttonActionPerformed

    form.tfPhone.onKeyReleased = function(evt) {//GEN-FIRST:event_tfPhoneKeyReleased
         if (clientModule.checkIfPhoneExist(form.tfPhone.text)){
             form.label.visible = false;
             form.button.text = "Подтвердить";
         } else {
             form.label.visible = true;
             form.button.text = "Зарегистрировать";
         }
    }//GEN-LAST:event_tfPhoneKeyReleased

    form.btnAnonimAction.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAnonimActionActionPerformed
        self.tradeSession.setClientPhone("79206738064");
        form.close();
    }//GEN-LAST:event_btnAnonimActionActionPerformed
    
    self.show = function() {
        form.show();
    };
}
