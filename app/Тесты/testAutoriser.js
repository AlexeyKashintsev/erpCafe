/**
 * 
 * @author Alexey
 * @module
 * @authorizer
 */ 
function testAutoriser() {
    var self = this, model = this.model;
    
    self.isUserInRole = function(aUser, aRole) {
        if (aUser === "testUser") 
            return true;
        else
            return false;
    };
}
