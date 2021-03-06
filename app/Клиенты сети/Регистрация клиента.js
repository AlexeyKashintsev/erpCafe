/**
 * 
 * @author stipjey
 */
function ClientRegistrationByBarist() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var clientModule = new ClientServerModule();
    var roleName = "client";
    var validateEmail = false;
    var validatePhone = false;
    
    form.btnAdd.onActionPerformed = function(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (validateForm()){
            clientModule.createUser(form.phoneField.text, form.emailField.text, form.firstnameField.text, roleName);
        }
        form.close(form.phoneField.text);
    }//GEN-LAST:event_btnAddActionPerformed

    function validateForm(){
        if (validateEmail && validatePhone){
            form.btnAdd.enabled = true;
            form.lblError.text = "";
            return true;
        } else {
            form.btnAdd.enabled = false;
            form.lblError.text = "Пользователь существует";
            return false;
        }
    }

    form.phoneField.onKeyReleased = function(evt) {//GEN-FIRST:event_phoneFieldKeyReleased
        if (clientModule.checkIfPhoneExist(form.phoneField.text)){
            validatePhone = false;
        } else {
            validatePhone = true;
        }
        validateForm();
    };//GEN-LAST:event_phoneFieldKeyReleased

    form.emailField.onKeyReleased = function(evt) {//GEN-FIRST:event_emailFieldKeyReleased
        if (clientModule.checkIfEmailExist(form.emailField.text)){
            validateEmail = false;
        } else {
            validateEmail = true;
        }
        validateForm();
    };//GEN-LAST:event_emailFieldKeyReleased
    
    self.show = function() {
        form.show();
    };
}
