/**
 * @name ChangePassView
*/
function ChangePassView(){
    var self = this, model = self.model, form = P.loadForm(this.constructor.name, model);
    var adminFunctions = new P.ServerModule("AdminFunctions");
    var userModule = new UserModule();
    var userName = null;
    
    self.setUserName = function(aUserName){
        userName = aUserName;
    };
       
    function clearData() {
        form.edNewPswd1.text = '';
        form.edNewPswd2.text = '';
    }

    form.btnOk.onActionPerformed = function(evt) {//GEN-FIRST:event_btnOkActionPerformed
        if (form.edNewPswd1.text != form.edNewPswd2.text) {
            warn('Необходимо ввести одинаковые пароли!', 'Предупреждение');
            return;
        }
        userModule.setPassword(userName, adminFunctions.MD5(form.edNewPswd1.text));
        self.modalResult = self.ok;
        self.close(true);	
    };//GEN-LAST:event_btnOkActionPerformed

    form.btnCancel.onActionPerformed = function(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);	
    };//GEN-LAST:event_btnCancelActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        form.label1.text = userName;
        form.label.foreground = Color.RED;
        form.btnOk.enabled = false;
        clearData();
    };//GEN-LAST:event_formWindowOpened
    
    function validateForm(){
        if (form.edNewPswd1.text.length >= 5 && form.edNewPswd2.text == form.edNewPswd1.text){
            form.btnOk.enabled = true;
            form.label.text = '';
        } else {
            form.btnOk.enabled = false;
        }
    }

    form.edNewPswd1.onFocusLost = function(evt) {//GEN-FIRST:event_edNewPswd1FocusLost
        validateForm();
    };//GEN-LAST:event_edNewPswd1FocusLost

    form.edNewPswd2.onFocusLost = function(evt) {//GEN-FIRST:event_edNewPswd2FocusLost
        validateForm();
    };//GEN-LAST:event_edNewPswd2FocusLost

    form.edNewPswd2.onKeyReleased = function(evt) {//GEN-FIRST:event_edNewPswd2KeyReleased
        if (form.edNewPswd2.text != form.edNewPswd1.text){
            form.label.text = 'Пароли не совпадают';
        } else form.label.text = '';
        validateForm();
    };//GEN-LAST:event_edNewPswd2KeyReleased

    form.edNewPswd1.onKeyReleased = function(evt) {//GEN-FIRST:event_edNewPswd1KeyReleased
        if (form.edNewPswd1.text.length < 5){
            form.label.text = 'Пароль меньше 6 символов';
        } else form.label.text = '';
        validateForm();
    };//GEN-LAST:event_edNewPswd1KeyReleased
    
    self.show = function() {
        form.show();
    };
}
