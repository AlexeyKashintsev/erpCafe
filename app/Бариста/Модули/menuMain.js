/**
 * 
 * @author Work
 * @resident
 * @module 
 */
function menuMain() {
    var self = this, model = this.model;
    
    var widgetCreator = new WidgetCreator();
    widgetCreator.OrderListPane();
    
    self.addItem = function (anItemData, aOrderList) {
        widgetCreator.orderItem(anItemData, aOrderList)
    };
    
    addItem = self.addItem;
}
