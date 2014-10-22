/**
 * 
 * @author Alexey
 * @module
 * @resident
 */ 
function clientServerSessionSynchronizer() {
    var self = this, model = this.model;
    var getLock = new Lock();
    var loadModules = [];
    Session = {};
    
    Session.get = function(aModuleName) {
        var userName = getSessionUserName();
        if (!Session[userName][aModuleName]) {
            loadModules[userName][aModuleName] = true;
            Session[userName][aModuleName] = new Module(aModuleName);
            Session[userName][aModuleName].createOnGet = true;
            loadModules[userName][aModuleName] = false;
        }
        return Session[userName][aModuleName];
    };
    
    Session.set = function(aModuleName, aModule) {
        var userName = getSessionUserName();
        if (!loadModules[userName][aModuleName]) {
            if (!Session[userName][aModuleName] || Session[userName][aModuleName].createOnGet) {
                Session[userName][aModuleName] = aModule;
                Session[userName][aModuleName].createOnGet = false;
                return true;
            } else 
                return Session[userName][aModuleName];
        } return true;
    };
    
    Session.login = function() {
        var userName = self.principal.name;
        Session[userName] = {};
        loadModules[userName] = [];
    };
    
    Session.logout = function() {
        var userName = self.principal.name;
        delete Session[userName];
        delete loadModules[userName];
    };
    
    function getSessionUserName() {
        var userName = self.principal.name;
        if (!Session[userName])
            Session.login();
        return userName;
    }
}
