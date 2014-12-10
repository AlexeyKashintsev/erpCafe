/**
 * @author jskonst
 * @authorizer
 * @stateless
 */ 
function authorizer() {
    var self = this, model = this.model;
    
    // TODO Это плохо. Тут же теперь пользователь всегда будет кем угодно. Совсем плохо!!!
    self.isUserInRole = function(){
        return true;
    };
}
