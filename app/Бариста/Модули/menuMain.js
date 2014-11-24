/**
 * 
 * @author Work
 * @module 
 */
function menuMain() {
    var self = this, model = this.model;
    
    var widgetCreator = new WidgetCreatorBaristaDesktop();
    widgetCreator.OrderListPane();
    
    self.addItem = function (anItemData, aOrderList) {
        widgetCreator.OrderListPane.orderItem(anItemData, aOrderList);
    };
    
    addItem = self.addItem;
}
