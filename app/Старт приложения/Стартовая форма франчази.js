/**
 * 
 * @author mike
 * @rolesAllowed franchazi
 */
function AdminStartForm() {
    var self = this, model = this.model, form = this;
    var MSG_ERROR_INACTIVE_USER = 'Ваша учетная запись неактивна!\nОбратитесь к администратору';
    var MSG_ERROR_NO_FRANCHAZI_4USER = 'Пользователь не закреплен за франчази!\nОбратитесь к администратору';
    
    var ep = new ServerModule('EventProcessor');
    var guiUtils = new guiModule();
    var usersView = null;
    var workShop = null;
    
    model.params.userName = self.principal.name;
    ep.addEvent('userLogin', null);
    
    function qFrancByUserNameOnRequeried(evt) {//GEN-FIRST:event_qFrancByUserNameOnRequeried
        var franchazi = model.qFrancByUserName.franchazi_id;
        if (franchazi) {
            if (model.qFrancByUserName.cursor.franc_users_active){
                model.params.franchaziId = franchazi;
                
                usersView = new FranchaziUsers();
                workShop = new FranchaziWorkShop();
                
                usersView.setFranchaziId(franchazi);
                workShop.setFranchaziId(franchazi);

            } else {
                alert(MSG_ERROR_INACTIVE_USER);
                ep.addEvent('userNotActive', {username : model.params.userName});
                self.close();
            }
        } else {
            alert(MSG_ERROR_NO_FRANCHAZI_4USER);
            ep.addEvent('userNotActive', {username : model.params.userName});
            self.close();
        }
    }//GEN-LAST:event_qFrancByUserNameOnRequeried

self.showFormAsInternal = function(aForm) {
    if(!guiUtils.showOpenedForm(aForm, form.desktop)){
        var frameRunner = aForm;
        var lenCookie = guiUtils.beginLengthyOperation(this);
        try{
            frameRunner.desktop = form.desktop;
            frameRunner.showInternalFrame(form.desktop);
        }finally{
            lenCookie.end();
        }
        frameRunner.toFront();
    }
};

    function btnUsersViewActionPerformed(evt) {//GEN-FIRST:event_btnUsersViewActionPerformed
        self.showFormAsInternal(usersView);
    }//GEN-LAST:event_btnUsersViewActionPerformed

    function button2ActionPerformed(evt) {//GEN-FIRST:event_button2ActionPerformed
        self.showFormAsInternal(workShop);
    }//GEN-LAST:event_button2ActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qFrancByUserName.requery();
    }//GEN-LAST:event_formWindowOpened
}
