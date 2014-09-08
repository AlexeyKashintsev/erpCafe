/**
 * @name ChangePassView
*/
function ChangePassView(){
    var self = this, model = self.model, form = P.loadForm(this.constructor.name, model);
    var adminFunctions = new ServerModule("AdminFunctions");
    var userModule = new UserModule();
    var userName = null;
    
    self.setUserName = function(aUserName){
        userName = aUserName;
    };
       
    function clearData() {
        form.edNewPswd1.text = '';
        form.edNewPswd2.text = '';
    }

    function btnOkActionPerformed(evt) {//GEN-FIRST:event_btnOkActionPerformed
        if (form.edNewPswd1.text != form.edNewPswd2.text) {
            warn('Необходимо ввести одинаковые пароли!', 'Предупреждение');
            return;
        }
        userModule.setPassword(userName, adminFunctions.MD5(form.edNewPswd1.text));
        self.modalResult = self.ok;
        self.close(true);	
    }//GEN-LAST:event_btnOkActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);	
    }//GEN-LAST:event_btnCancelActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.label1.text = userName;
        form.label.foreground = Color.RED;
        form.btnOk.enabled = false;
        clearData();
    }//GEN-LAST:event_formWindowOpened

    function edNewPswd1KeyTyped(evt) {//GEN-FIRST:event_edNewPswd1KeyTyped
        
    }//GEN-LAST:event_edNewPswd1KeyTyped

    function edNewPswd2KeyTyped(evt) {//GEN-FIRST:event_edNewPswd2KeyTyped
        
    }//GEN-LAST:event_edNewPswd2KeyTyped
    
    function validateForm(){
        if (form.edNewPswd1.text.length >= 5 && form.edNewPswd2.text == form.edNewPswd1.text){
            form.btnOk.enabled = true;
            form.label.text = '';
        } else {
            form.btnOk.enabled = false;
        }
    }


    function edNewPswd1FocusLost(evt) {//GEN-FIRST:event_edNewPswd1FocusLost
        validateForm();
    }//GEN-LAST:event_edNewPswd1FocusLost

    function edNewPswd2FocusLost(evt) {//GEN-FIRST:event_edNewPswd2FocusLost
        validateForm();
    }//GEN-LAST:event_edNewPswd2FocusLost

    function edNewPswd2KeyReleased(evt) {//GEN-FIRST:event_edNewPswd2KeyReleased
        if (form.edNewPswd2.text != form.edNewPswd1.text){
            form.label.text = 'Пароли не совпадают';
        } else form.label.text = '';
        validateForm();
    }//GEN-LAST:event_edNewPswd2KeyReleased

    function edNewPswd1KeyReleased(evt) {//GEN-FIRST:event_edNewPswd1KeyReleased
        if (form.edNewPswd1.text.length < 5){
            form.label.text = 'Пароль меньше 6 символов';
        } else form.label.text = '';
        validateForm();
    }//GEN-LAST:event_edNewPswd1KeyReleased
}
