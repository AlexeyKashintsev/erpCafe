/**
 * 
 * @author Alexey
 * @public 
 * @constructor
 */
function testServM() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    self.test = function(aValue) {
        P.Logger.info(aValue.b);
    };
}
