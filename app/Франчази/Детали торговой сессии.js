/**
 * 
 * @author Alexey
 */
function TradeSessionDetails() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    self.show = function() {
        form.show();
    };
}
