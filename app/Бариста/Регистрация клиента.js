/**
 * 
 * @author stipjey
 */
function ClientRegistrationByBarist() {
    var self = this, model = this.model, form = this;
    var clientModule = new ClientServerModule();
    var userModule = new UserModule();
    var adminFunctions = new ServerModule("AdminFunctions");
    var roleName = "client";
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var genPass = Math.random().toString(36);
        userModule.createUser(form.phoneField.text, null,roleName, form.emailField.text, form.phoneField.text);
        clientModule.createUser(form.phoneField.text, form.emailField.text, form.firstnameField.text);
    }//GEN-LAST:event_buttonActionPerformed
}
