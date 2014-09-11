/**
 * 
 * @author Алексей
 * @public
 */ 
function UserSession() {
    var self = this, model = P.loadModel(this.constructor.name);
    var ep = new EventProcessor();
    self.userRole = null;
    self.franchaziId = null;
    
    self.msg = {
        MSG_ERROR_INACTIVE_USER         :   'Ваша учетная запись неактивна!\nОбратитесь к администратору',
        MSG_ERROR_NO_FRANCHAZI_4USER    :   'Пользователь не закреплен за франчази!\nОбратитесь к администратору',
        MSG_ERROR_NOT_UNDER_BROWSER     :   'Данный функционал не работает под браузером'
    };
    
    self.login = function() {
        P.Logger.info('Try to login');
        model.params.userName = P.principal.name;
        P.Logger.info('User name: ' + model.params.userName);
        model.qFrancByUserName.requery();
        model.params.franchaziId = model.qFrancByUserName.cursor.franchazi_id;
        ep.addEvent('userLogin', null);
        return self.getUserRole();//model.params.franchaziId;
    };
    
    self.getFranchazi = function() {
        return model.params.franchaziId;
    };
    
    self.getActiveTPSession = function() {
        model.qOpenedSession.execute();
        return model.qOpenedSession.empty ? false : model.qOpenedSession.cursor.org_session_id;
    };
    
    self.getUserName = function() {
        return P.principal.name;
    };
    
    self.getUserRole = function() {
        /*var roles = ['admin', 'franchazi', 'barista'];
        for (var j in roles)
            if (P.principal.hasRole(roles[j]))
                break;*/
//        /return roles[j];
        model.qRolesByUserName.requery();
        P.Logger.info("Role: " + model.qRolesByUserName.cursor.group_name);
        return model.qRolesByUserName.cursor.group_name;
    };

    function qFrancByUserNameOnRequeried(evt) {//GEN-FIRST:event_qFrancByUserNameOnRequeried
        var franchazi = model.qFrancByUserName.franchazi_id;
        if (franchazi) {
            if (model.qFrancByUserName.cursor.franc_users_active){
                model.params.franchaziId = franchazi;
            } else {
                model.params.franchaziId = null;
                alert(self.msg[MSG_ERROR_INACTIVE_USER]);
                ep.addEvent('userNotActive', {username : model.params.userName});
                self.close();
            }
        } else {
            model.params.franchaziId = null;
            //alert(self.msg[MSG_ERROR_NO_FRANCHAZI_4USER]);
            ep.addEvent('userNotActive', {username : model.params.userName});
            self.close();
        }
    }//GEN-LAST:event_qFrancByUserNameOnRequeried
}
