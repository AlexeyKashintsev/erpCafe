/**
 * 
 * @author Алексей
 * @public
 * @module
 */ 
function UserSession() {
    var self = this, model = this.model;
    var ep = new EventProcessor();
    var lastCheck = null;
    
    self.msg = {
        MSG_ERROR_INACTIVE_USER         :   'Ваша учетная запись неактивна!\nОбратитесь к администратору',
        MSG_ERROR_NO_FRANCHAZI_4USER    :   'Пользователь не закреплен за франчази!\nОбратитесь к администратору',
        MSG_ERROR_NOT_UNDER_BROWSER     :   'Данный функционал не работает под браузером'
    };
    //test
    //Session.login();
    Session.set('UserSession', this);
    model.params.userName = self.principal.name;
    if (!self.principal.hasRole('client'))
        model.qFrancByUserName.requery();
    ep.addEvent('userLogin', null);
    lastCheck = new Date();
    
    self.logout = function() {
        Logger.info('Session closed');
        Session.logout();
    };
    
    self.keepAlive = function(aUserName) {
        Session.keepAlive();
        return (aUserName == self.principal.name);
    };
    
    function refresh() {
        model.params.userName = self.principal.name;
        model.qFrancByUserName.execute();
        if (!model.qFrancByUserName.empty){
            model.params.franchaziId = model.qFrancByUserName.franchazi_id;
        }
    }
    
    self.getFranchazi = function() {
        if (!model.params.franchaziId)
            refresh();
        return model.params.franchaziId;
    };
    
    self.getActiveTPSession = function() {
        model.qOpenedSession.requery();
        return model.qOpenedSession.empty ? false : 
                model.qOpenedSession.cursor.org_session_id;
    };
    
    self.getTradePoint = function() {
        model.qOpenedSession.requery();
        return model.qOpenedSession.empty ? false : 
                model.qOpenedSession.cursor.trade_point;
    };
    
    self.getCityByTradePoint = function() {
        model.qTradePoint.params.trade_point_id = self.getTradePoint();
        model.qTradePoint.requery();
        return model.qTradePoint.empty ? 0 : 
                model.qTradePoint.cursor.tp_city;
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
