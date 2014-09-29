/**
 * 
 * @author stipjey
 */
function ClientRegistrationByBarist() {
    var self = this, model = this.model, form = this;
    self.setPhone = function(aPhone) {
        form.phoneField.text = aPhone;
    };
    
    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (validateForm()){
            session.clientModule.createUser(form.phoneField.text, form.emailField.text, form.firstnameField.text);
        }
        form.close(form.phoneField.text);
    }//GEN-LAST:event_btnAddActionPerformed

    function validateForm(){
        if (ValidateLogin() && ValidateEmail() && ValidatePhone()){
            form.btnAdd.enabled = true;
            return true;
        } else {
            form.btnAdd.enabled = false;
            return false;
        }
    }

    function phoneFieldKeyReleased(evt) {//GEN-FIRST:event_phoneFieldKeyReleased
        validateForm();
    }//GEN-LAST:event_phoneFieldKeyReleased

    function emailFieldKeyReleased(evt) {//GEN-FIRST:event_emailFieldKeyReleased
        validateForm();
    }//GEN-LAST:event_emailFieldKeyReleased

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        validateForm();
    }//GEN-LAST:event_formWindowOpened
    
    function ValidatePhone(){
        var reg = /^(8)\d{10}/i;
        if (session.clientModule.checkIfPhoneExist(form.phoneField.text)){
            form.lblPhoneMsg.text = "Номер уже используется";
            return false;
        } else {
            if (reg.test(form.phoneField.text)){
                form.lblPhoneMsg.text = "";
                return true;
            } else {
                form.lblPhoneMsg.text = "Неверный формат номера";
                return false;
            }
        }
    }
    
    function ValidateLogin(){
        if(!form.firstnameField.text){
            form.lblEmailMsg.text = "Введите имя пользователя";
            return false;
        } else {
            form.lblEmailMsg.text = "";
            return true;
        }
    }
    
    function ValidateEmail(){
        var reg = /^([\w.-]+)@([a-zA-Z0-9.-]+[a-zA-Z]{2,6})/;
        if(!form.emailField.text){
            form.lblEmailMsg.text = "";
            return true;
        } else {
            if (session.clientModule.checkIfEmailExist(form.emailField.text)){
                form.lblEmailMsg.text = "Email уже используется";
                return false;
            } else {
                if (reg.test(form.emailField.text)) {
                    form.lblEmailMsg.text = "";
                    return true;
                } else {
                    form.lblEmailMsg.text = "Неверный формат Email";
                    return false;
                }
            }
        }
    }    

    function phoneFieldFocusLost(evt) {//GEN-FIRST:event_phoneFieldFocusLost
        validateForm();
    }//GEN-LAST:event_phoneFieldFocusLost

    function emailFieldFocusLost(evt) {//GEN-FIRST:event_emailFieldFocusLost
        validateForm();
    }//GEN-LAST:event_emailFieldFocusLost

    function firstnameFieldFocusLost(evt) {//GEN-FIRST:event_firstnameFieldFocusLost
        validateForm();
    }//GEN-LAST:event_firstnameFieldFocusLost
}
