/**
 * 
 * @author Алексей
 * @public
 * @module
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
        if (!self.principal.hasRole('client'))
            model.qFrancByUserName.requery();
        ep.addEvent('userLogin', null);
        return self.getUserRole();//model.params.franchaziId;
    };
    
    self.keepAlive = function(aUserName) {
        return (aUserName == self.principal.name);
    };
    
    function sync() {
        Logger.info('Synchronizing');
        model.params.userName = self.principal.name;
        if (!self.principal.hasRole('client'))
            model.qFrancByUserName.execute();
        if (model.qFrancByUserName.cursor){
            model.params.franchaziId = model.qFrancByUserName.franchazi_id;
        }
    }
    
    self.getFranchazi = function() {
        if (!model.params.franchaziId)
            sync();
        return model.params.franchaziId;
    };
    
    self.getActiveTPSession = function() {
        model.qOpenedSession.execute();
        return model.qOpenedSession.empty ? false : 
                model.qOpenedSession.cursor.org_session_id;
    };
    
    self.getTradePoint = function() {
        model.qOpenedSession.execute();
        return model.qOpenedSession.empty ? false : 
                model.qOpenedSession.cursor.trade_point;
    };
    
    self.getUserName = function() {
        return self.principal.name;
    };
    
    self.getUserRole = function() {
        var roles = ['admin', 'franchazi', 'barista', 'client'];
        for (var j in roles)
            if (self.principal.hasRole(roles[j]))
                break;
        return roles[j];
    };
    
    self.checkSession = function(aSession) {
        model.qSessionById.params.session_id = aSession;
        model.qSessionById.execute();
        if (!model.qSessionById.empty)
            return model.qSessionById.cursor.end_date === null;
        else
            return false;
    };

    function qFrancByUserNameOnRequeried(evt) {//GEN-FIRST:event_qFrancByUserNameOnRequeried
        if (self.principal.hasRole('barista')||self.principal.hasRole('franchazi')) {
            var franchazi = model.qFrancByUserName.franchazi_id;
            if (franchazi) {
                if (model.qFrancByUserName.cursor.franc_users_active){
                    model.params.franchaziId = franchazi;
                } else {
                    model.params.franchaziId = null;
                   // alert(self.msg.MSG_ERROR_INACTIVE_USER);
                    ep.addEvent('userNotActive', {username : model.params.userName});
                    self.close();
                }
            } else {
                model.params.franchaziId = null;
                //alert(self.msg[MSG_ERROR_NO_FRANCHAZI_4USER]);
                ep.addEvent('userNotActive', {username : model.params.userName});
                self.close();
            }
        }
    }//GEN-LAST:event_qFrancByUserNameOnRequeried
}
