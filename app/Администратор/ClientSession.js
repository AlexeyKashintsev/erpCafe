/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function getUserSession() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    return new P.ServerModule('UserSession');
}
