/**
 * @author jskonst
 * @authorizer
 * @stateless
 */ 
function authorizer() {
    var self = this, model = this.model;
    
    // TODO : place your code here
    self.isUserInRole = function(){
        return true;
    };
}
