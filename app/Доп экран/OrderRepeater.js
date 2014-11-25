/**
 * 
 * @author Alexey
 * @module
 */ 
function OrderRepeater(anOrder, orderSum) {
    var self = this, model = this.model;
    
    document.getElementById("actionPanel").innerHTML = "";
    var dockElement = cmn.createElement("div", 'baristaOrder panel panel-primary', "actionPanel");
    var newHTMLElement = document.createElement('div');
    newHTMLElement.innerHTML =
            "<div class='panel-heading'><h3 class='panel-title'>Заказ</h3></div>\
            <div id='orderItems'></div><div id='orderDetails'>\
            <div class='panel-body'>\
            <div id='orderSum'>Итого: " + orderSum + " рублей</div>\
            </div>";
    dockElement.appendChild(newHTMLElement);
    
    for (var anItemData in anOrder.orderDetails){
        orderView(anOrder.orderDetails[anItemData]);
    }
    
    function orderView(anItemData) {
        var obj = this;

        obj.docDiv = document.getElementById("orderItems");
        obj.divEl = document.createElement("div");
        obj.divEl.className = "orderItem";
        obj.docDiv.appendChild(obj.divEl);

        obj.label = document.createElement("h4");
        obj.divEl.appendChild(obj.label);
        obj.label.className = "itemName";

        obj.count = document.createElement("h4");
        obj.divEl.appendChild(obj.count);
        obj.count.className = "itemCount";

        obj.updateText = 
        obj.show = function() {
            obj.label.innerHTML = obj.itemName;
            obj.count.innerHTML = obj.orderQuantity + ' шт. ' + obj.orderSum + " р.";
        };

        obj.orderQuantity = anItemData.orderQuantity;
        obj.itemId = anItemData.itemId;
        obj.itemName = anItemData.itemName;
        obj.itemCost = anItemData.itemCost;
        obj.orderSum = anItemData.orderSum;
        obj.stop = false;

        obj.show();
        return obj;
    };
}
