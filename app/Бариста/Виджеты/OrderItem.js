/**
 * 
 * @author Alexey
 * @module
 */ 
function OrderItem(anItemData, aPriceType, aPrice) {
    var ordItem = this;

    ordItem.orderQuantity = 0;
    ordItem.itemId = anItemData.item_id;
    ordItem.itemName = anItemData.item_name;
    ordItem.itemCost = aPrice ? aPrice : anItemData.item_cost;
    ordItem.measure = anItemData.item_measure;
    ordItem.priceType = aPriceType;
    ordItem.orderSum = 0;
    
    ordItem.setQuantity = function(anQuantity) {
        ordItem.orderQuantity = anQuantity;
        ordItem.orderSum = ordItem.orderQuantity * ordItem.itemCost;
        ordItem.view.updateText();
        orderList.calculateOrder();        
    };
    
    ordItem.increase = function() {
        ordItem.orderSum = ++ordItem.orderQuantity * ordItem.itemCost;
        ordItem.view.updateText();
        orderList.calculateOrder();
    };

    ordItem.decrease = function() {
        if (ordItem.orderQuantity > 1)
            ordItem.orderSum = --ordItem.orderQuantity * ordItem.itemCost;
        else
            ordItem.delete();
        ordItem.view.updateText();
        orderList.calculateOrder();
    };

    ordItem.delete = function(aWORecalc) {
        ordItem.orderSum = ordItem.orderQuantity = 0;
        delete(orderList.orderDetails[ordItem.itemId][ordItem.priceType]);
        ordItem.view.delete();
        if (!!aWORecalc) orderList.calculateOrder();
    };

    ordItem.view = new wf.OrderItem(ordItem);
}
