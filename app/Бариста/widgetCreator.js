/**
 * 
 * @author Alexey
 * @module
 */ 
function WidgetCreator() {
    var self = this, model = this.model;
    
    self.tradeItem = function(aContainer, aData, onClick) {
        var itemContainer = cmn.createElement("div", "itemDescription tt_"
                + aData.trade_item_type_id + (aData.classtag ? " " + aData.classtag : ""), aContainer);
        var itemPanel = cmn.createElement("div", "panel panel-primary", itemContainer);
        var itemHeading = cmn.createElement("div", "panel-heading", itemPanel);
        var itemDesc = cmn.createElement("h3", "panel-title itemDesc", itemHeading);
        var itemContent = cmn.createElement("div", "panel-body", itemPanel);
        var itemCost = cmn.createElement("h1", "itemCost", itemContent);
        var itemType = cmn.createElement("p", "itemType", itemContent);

        itemDesc.innerHTML = aData.item_name;
        itemType.innerHTML = aData.type_name;
        itemCost.innerHTML = aData.item_cost + 'р.';

        itemPanel.onclick = function() {
            onClick(aData);
        };
    };
    
    self.createOrderListPane = function() {
        var dockElement = cmn.createElement("div", 'baristaOrder panel panel-primary', "actionPanel");

        var newHTMLElement = document.createElement('div');
        newHTMLElement.innerHTML =
                "<div class='panel-heading'><h3 class='panel-title'>Заказ</h3></div>\
                <div id='orderItems'></div><div id='orderDetails'>\
                <div class='panel-body'>\
                <div id='orderSum'>Итого: 0 рублей</div>\
                </div>";
        dockElement.appendChild(newHTMLElement);

        var newHTMLElement = document.createElement('button');
        newHTMLElement.innerHTML = 'Отменить';
        newHTMLElement.className = 'btnCancel';
        newHTMLElement.onclick = self.deleteOrder;
        dockElement.appendChild(newHTMLElement);

        newHTMLElement = document.createElement('button');
        newHTMLElement.innerHTML = 'Оплатить';
        newHTMLElement.className = 'btnOk';
        dockElement.appendChild(newHTMLElement);
        newHTMLElement.onclick = self.acceptOrder;
    };
    
    self.typeItem = function(aContainer, typeData) {
        
    };
    
    self.orderItem = function(anItemData, aOrderList) {
        var obj = {};

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

        /*    obj.sum = document.createElement("h4");
         obj.divEl.appendChild(obj.sum);
         obj.sum.className = "itemSum";*/

        /*obj.btnAdd = document.createElement("button");
         obj.btnAdd.innerHTML = '<span class="glyphicon glyphicon-plus"></span>';
         obj.btnAdd.className = "addBtn";
         obj.divEl.appendChild(obj.btnAdd);*/

        obj.btnRemove = document.createElement("button");
        obj.btnRemove.innerHTML = '<span class="glyphicon glyphicon-minus"></span>';
        obj.btnRemove.className = "removeBtn";

        obj.btnDelete = document.createElement("button");
        obj.btnDelete.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
        obj.btnDelete.className = "deleteBtn";

        obj.divEl.appendChild(obj.btnRemove);
        obj.divEl.appendChild(obj.btnDelete);

        obj.updateText = 
        obj.show = function() {
            obj.label.innerHTML = obj.itemName;
            obj.count.innerHTML = obj.orderQuantity + ' шт. ' + obj.orderSum + " р.";
            //  obj.sum.innerHTML = obj.orderSum + " р.";
            obj.parent.calculateOrder();
        };
        
        obj.orderQuantity = 1;
        obj.itemId = anItemData.item_id;
        obj.itemName = anItemData.item_name;
        obj.itemCost = anItemData.item_cost;
        obj.orderSum = anItemData.item_cost;
        obj.parent = aOrderList;
        obj.stop = false;

        obj.increase = function() {
            obj.orderSum = ++obj.orderQuantity * obj.itemCost;
            obj.updateText();
        };

        obj.decrease = function() {
            if (obj.orderQuantity > 1)
                obj.orderSum = --obj.orderQuantity * obj.itemCost;
            else
                obj.delete();
            obj.updateText();
        };

        obj.delete = function() {
            obj.orderSum = obj.orderQuantity = 0;
            delete(obj.parent.orderDetails[obj.itemId]);
            obj.parent.pnlOrderList.remove(obj.panel);
            obj.parent.calculateOrder();
            obj.docDiv.removeChild(obj.divEl);
        };

        obj.divEl.onclick = function() {
            if (!obj.stop)
                obj.increase();
            else
                obj.stop = false;
        };
        obj.btnRemove.onclick = function() {
            obj.decrease();
            obj.stop = true;
        };
        obj.btnDelete.onclick = obj.delete;

        obj.show();
        return obj;
    };
}
