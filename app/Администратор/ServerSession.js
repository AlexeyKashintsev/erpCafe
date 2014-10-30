/**
 * 
 * @author Alexey
 * @module
 * @resident
 */ 
function ServerSession() {
    var self = this, model = this.model;
    var IDLE_TIME = 20;//In minutes
    var loadModules = [];
    Session = {};
    var sessions = {};
    
    Session.get = function(aModuleName) {
        var userName = getSessionUserName();
        if (!sessions[userName][aModuleName]) {
            loadModules[userName][aModuleName] = true;
            sessions[userName][aModuleName] = new Module(aModuleName);
            sessions[userName][aModuleName].createOnGet = true;
            loadModules[userName][aModuleName] = false;
        }
        return sessions[userName][aModuleName];
    };
    
    Session.set = function(aModuleName, aModule) {
        var userName = getSessionUserName();
        if (!loadModules[userName][aModuleName]) {
            if (!sessions[userName][aModuleName] || sessions[userName][aModuleName].createOnGet) {
                sessions[userName][aModuleName] = aModule;
                sessions[userName][aModuleName].createOnGet = false;
                return true;
            } else 
                return sessions[userName][aModuleName];
        } return true;
    };
    
    Session.keepAlive = function(aUserName) {
        var userName = aUserName ? aUserName : self.principal.name;
        sessions[userName].lastTime = new Date();
        Logger.finest('Keep session alive for user ' + userName);
    };
    
    Session.login = function() {
        var userName = self.principal.name;
        Logger.fine('New session for user ' + userName);
        sessions[userName] = {};
        loadModules[userName] = [];
        Session.keepAlive(userName);
    };
    
    Session.logout = function(aSessionUser) {
        var userName = aSessionUser ? aSessionUser : self.principal.name;
        Logger.fine('Closing session for user ' + userName);
        delete sessions[userName];
        delete loadModules[userName];
    };
    
    function getSessionUserName() {
        var userName = self.principal.name;
        if (!sessions[userName])
            Session.login();
        Session.keepAlive(userName);
        return userName;
    }
    
    function watchDog() {
        Logger.info('New watchDog!');
        for (var j = 0; j < 60; j++)
            java.lang.Thread.sleep(1000);
        var checkTime = new Date();
        Logger.info('WatchDog work');
        for (var j in sessions) 
            if (checkTime - sessions[j].lastTime > 60 * 1000 * IDLE_TIME) {
                Logger.fine('Session timeout for user ' + j);
                Session.logout(j);
            }
        watchDog();
    };
    
    (function () {
        watchDog();
    }).invokeBackground();
}
