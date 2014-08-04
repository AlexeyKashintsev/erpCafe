/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function testModule() {
    var self = this, model = this.model;
    var stateVal = 0;
    
    self.setState = function(aValue) {
        stateVal = aValue;
    };
    
    self.getState = function() {
        return self.principal.name;
    };
}
