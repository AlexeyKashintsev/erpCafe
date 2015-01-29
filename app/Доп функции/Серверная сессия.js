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
    var eventProcessor = new EventProcessor();
    Session = {};
    Session.chat = {};
    Session.chat.usersCount = 0;
    var sessions = {};
    
    Session.get = function(aModuleName) {
        var userName = getSessionUserName();
        Logger.finest('Get module ' + aModuleName);
        if (!sessions[userName][aModuleName]) {
            Logger.finest('Module isn\'t loaded yet');
            loadModules[userName][aModuleName] = true;
            sessions[userName][aModuleName] = new Module(aModuleName);
            if (!sessions[userName][aModuleName]) {
                eventProcessor.addEvent("moduleIsNotCreated", {moduleName : aModuleName, userName : userName});
                Logger.warning('Module ' + aModuleName + ' wasn\'t created for user ' + userName );
            } else {
                sessions[userName][aModuleName].createOnGet = true;
                loadModules[userName][aModuleName] = false;
                Logger.finest('Ok! Module successufully loaded');
            }
        } else {
            Logger.finest('Ok! Module exists');
        }
        return sessions[userName][aModuleName];
    };
    
    Session.set = function(aModuleName, aModule) {
        Logger.finest('Module created ' + aModuleName);
        var userName = getSessionUserName();
        if (!loadModules[userName][aModuleName]) {
            Logger.finest('Ok! Module isn\'t exist in session');
            if (!sessions[userName][aModuleName] || sessions[userName][aModuleName].createOnGet) {
                sessions[userName][aModuleName] = aModule;
                sessions[userName][aModuleName].createOnGet = false;
                return true;
            } else {
                Logger.finest('Fail! Module is in session already');
                return sessions[userName][aModuleName];
            }
        } else {
            Logger.finest('Ok! Module is in get process');
            return true;
        }
    };
    
    Session.keepAlive = function(aUserName) {
        try {
            var userName = aUserName ? aUserName : self.principal.name;
            sessions[userName].lastTime = new Date();
            Logger.finest('Keep session alive for user ' + userName);
        } catch (e) {
            Logger.warning('No session for user ' + aUserName);
        }
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
                // Logger.info('New watchDog!');
        for (var j = 0; j < 60; j++)
            java.lang.Thread.sleep(1000);
        var checkTime = new Date();
      //  Logger.info('WatchDog work');
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
