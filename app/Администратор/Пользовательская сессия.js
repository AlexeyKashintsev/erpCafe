/**
 * 
 * @author Алексей
 * @module
 * @public
 */ 
function UserSession() {
    var self = this, model = this.model;
    var ep = new EventProcessor();
    self.msg = {
        MSG_ERROR_INACTIVE_USER         :   'Ваша учетная запись неактивна!\nОбратитесь к администратору',
        MSG_ERROR_NO_FRANCHAZI_4USER    :   'Пользователь не закреплен за франчази!\nОбратитесь к администратору',
        MSG_ERROR_NOT_UNDER_BROWSER     :   'Данный функционал не работает под браузером'
    };
    
    self.login = function() {
        model.params.userName = self.principal.name;
        model.qFrancByUserName.requery();
        ep.addEvent('userLogin', null);
        return model.params.franchaziId;
    };
    
    self.getFranchazi = function() {
        return model.params.franchaziId;
    };

    function qFrancByUserNameOnRequeried(evt) {//GEN-FIRST:event_qFrancByUserNameOnRequeried
        var franchazi = model.qFrancByUserName.franchazi_id;
        if (franchazi) {
            if (model.qFrancByUserName.cursor.franc_users_active){
                model.params.franchaziId = franchazi;
            } else {
                alert(self.msg[MSG_ERROR_INACTIVE_USER]);
                ep.addEvent('userNotActive', {username : model.params.userName});
                self.close();
            }
        } else {
            alert(self.msg[MSG_ERROR_NO_FRANCHAZI_4USER]);
            ep.addEvent('userNotActive', {username : model.params.userName});
            self.close();
        }
    }//GEN-LAST:event_qFrancByUserNameOnRequeried
}
