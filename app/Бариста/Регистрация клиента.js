/**
 * 
 * @author stipjey
 */
function ClientRegistrationByBarist() {
    var self = this, model = this.model, form = this;
    var clientModule = new ClientServerModule();
    var roleName = "client";
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        clientModule.createUser(form.phoneField.text, form.emailField.text, form.firstnameField.text, roleName);
    }//GEN-LAST:event_buttonActionPerformed
}
