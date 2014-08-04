/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function getUserSession() {
    var self = this, model = this.model;
    
    return new ServerModule('UserSession');
}
