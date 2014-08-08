/**
 * 
 * @author stipjey
 */
function ClientRegistrationByBarist() {
    var self = this, model = this.model, form = this;
    var clientModule = new ClientServerModule();
    var adminFunctions = new ServerModule("AdminFunctions");
    var roleName = "client";
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var genPass = Math.random().toString(36);
        alert('Ваш пароль: ' + genPass);
        clientModule.createUser(form.phoneField.text, adminFunctions.MD5(genPass), roleName, form.emailField.text);
    }//GEN-LAST:event_buttonActionPerformed
}
