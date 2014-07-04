/**
 * @name ChangePassView
*/
function ChangePassView(){
    var self = this, model = self.model, form = this;
    var adminFunctions = new ServerModule("AdminFunctions");
    
    self.setUserId = function(aUserId){
        model.params.parUser = aUserId;
    };
       
    function clearData() {
        form.edNewPswd1.text = '';
        form.edNewPswd2.text = '';
        model.requery();
    }

    function btnOkActionPerformed(evt) {//GEN-FIRST:event_btnOkActionPerformed
        if (form.edNewPswd1.text != form.edNewPswd2.text) {
            warn('Необходимо ввести одинаковые пароли!', 'Предупреждение');
            return;
        }
        model.dsUser.usr_passwd =  adminFunctions.MD5(form.edNewPswd1.text);
        model.save();
        //dsUser.save();
        self.modalResult = self.ok;
        self.close(true);	
    }//GEN-LAST:event_btnOkActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);	
    }//GEN-LAST:event_btnCancelActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        clearData();
    }//GEN-LAST:event_formWindowOpened
}
