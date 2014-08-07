/**
 * 
 * @author stipjey
 */
function ClientRegistrationByBarist() {
    var self = this, model = this.model, form = this;
    var clientModule = new ClientServerModule();
    
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
       
        clientModule.AddNewUser(form.phoneField.text, Math.random().toString(36));
        model.qClientRegistration.push({
            usr_name : form.phoneField.text,
            reg_date : new Date(),
            email : form.emailField.text
        });
        
        model.save(function(){
           form.close(true);
        });
    }//GEN-LAST:event_buttonActionPerformed
}
