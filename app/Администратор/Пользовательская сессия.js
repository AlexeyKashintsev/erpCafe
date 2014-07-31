/**
 * 
 * @author Алексей
 * @module
 */ 
function UserSession() {
    var self = this, model = this.model;
    var ep = new EventProcessor();
    var MSG_ERROR_INACTIVE_USER = 'Ваша учетная запись неактивна!\nОбратитесь к администратору';
    var MSG_ERROR_NO_FRANCHAZI_4USER = 'Пользователь не закреплен за франчази!\nОбратитесь к администратору';
    
    self.login = function(){
        model.params.userName = self.principal.name;
        model.qFrancByUserName.requery();
        ep.addEvent('userLogin', null);
        return model.params.franchaziId;
    };

    function qFrancByUserNameOnRequeried(evt) {//GEN-FIRST:event_qFrancByUserNameOnRequeried
        var franchazi = model.qFrancByUserName.franchazi_id;
        if (franchazi) {
            if (model.qFrancByUserName.cursor.franc_users_active){
                model.params.franchaziId = franchazi;
            } else {
                alert(MSG_ERROR_INACTIVE_USER);
                ep.addEvent('userNotActive', {username : model.params.userName});
                self.application.close();
            }
        } else {
            alert(MSG_ERROR_NO_FRANCHAZI_4USER);
            ep.addEvent('userNotActive', {username : model.params.userName});
            self.close();
        }
    }//GEN-LAST:event_qFrancByUserNameOnRequeried
}
