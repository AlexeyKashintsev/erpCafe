/**
 * 
 * @author Work
 * @module 
 */
function as_welcome() {
    var self = this, model = this.model;

    self.setOrder = function (anOrder, orderSum) {
        var OR = new OrderRepeater(anOrder, orderSum);
    };

    setOrder = self.setOrder;
}
