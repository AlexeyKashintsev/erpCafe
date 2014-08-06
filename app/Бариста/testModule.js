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
        Logger.info(aValue);
    };
    
    self.getState = function() {
        Logger.info(stateVal);
        return stateVal;
    };
}
