/**
 * 
 * @author Work
 * @resident
 * @module 
 */
function menuMain() {
    var self = this, model = this.model;
    
    document.write("This is 5 x 7: " + opener.globalGetValue(7));
    
    function makeACall(aMessage) {
        document.getElementById('message').innerHTML = aMessage;
    }
    
    this.globalSetMessage = makeACall;
    
}
