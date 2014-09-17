/**
 * 
 * @author stipjey
 */
function ClientRegistrationByBarist() {
    var self = this, model = this.model, form = this;
    var roleName = "client";
    var validateEmail = false;
    var validatePhone = false;
    
    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (validateForm()){
            session.clientModule.createUser(form.phoneField.text, form.emailField.text, form.firstnameField.text, roleName);
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

    function phoneFieldKeyReleased(evt) {//GEN-FIRST:event_phoneFieldKeyReleased
        if (session.clientModule.checkIfPhoneExist(form.phoneField.text)){
            validatePhone = false;
        } else {
            validatePhone = true;
        }
        validateForm();
    }//GEN-LAST:event_phoneFieldKeyReleased

    function emailFieldKeyReleased(evt) {//GEN-FIRST:event_emailFieldKeyReleased
        if (session.clientModule.checkIfEmailExist(form.emailField.text)){
            validateEmail = false;
        } else {
            validateEmail = true;
        }
        validateForm();
    }//GEN-LAST:event_emailFieldKeyReleased
}
