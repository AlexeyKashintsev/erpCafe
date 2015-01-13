/**
 * 
 * @author Alexey
 * @module
 */ 
function WidgetCreatorBaristaDesktop() {
    var self = this, model = this.model;
    
    self.tradeItem = function(aContainer, aData, onClick) {
        var itemContainer = cmn.createElement("div", "Sortable itemDescription tt_"
            + aData.trade_item_type_id + (aData.classtag ? " " + aData.classtag : ""),
            aContainer, "tt_" + aData.item_id);
        var itemPanel = cmn.createElement("div", "panel panel-primary", itemContainer);
        //var itemHeading = cmn.createElement("div", "panel-heading", itemPanel);
        var itemContent = cmn.createElement("div", "panel-body", itemPanel);
        //var itemType = cmn.createElement("p", "itemType", itemContent);
        var itemDesc = cmn.createElement("h3", "itemDesc", itemContent);//itemHeading);
        var itemCost = cmn.createElement("h1", "itemCost", itemContent);
        

        itemDesc.innerHTML = aData.item_name;
        //itemType.innerHTML = aData.type_name;
        itemCost.innerHTML = aData.item_cost + 'р.';
        
        itemPanel.onclick = function() {
 
                onClick(aData);
 
        };
    };
    
    self.typeItem = function(aContainer, aData, onClick) {
        var obj = this;
        obj.itemContainer = cmn.createElement("div", "typeSelector tt_"
                + aData.trade_item_type_id + (aData.classtag ? " " + aData.classtag : ""), aContainer);
        obj.itemName = cmn.createElement("div", "type_name", obj.itemContainer);
        obj.itemName.innerHTML = aData.type_name;
        
        obj.selected = false;
        obj.active = true;
        
        obj.itemContainer.onclick = function () {
            onClick(obj);
        };
        
        obj.setState = function (aState) {
            obj.active = aState.active;
            obj.selected = aState.selected;
        };
    };

    self.OrderListPane = function(aContainer, anAcceptOrder, aDeleteOrder) {
        var dockElement = cmn.createElement("div", 'baristaOrder panel panel-primary', aContainer);

        var newHTMLElement = cmn.createElement("div", "", dockElement);
        newHTMLElement.innerHTML =
                "\
                <div class='panel-heading'>\
                    <h3 class='panel-title'>Заказ</h3>\n\
                </div>\
                <div id='orderItems'></div>\
                <div id='orderDetails'>\
                <div class='panel-body'>\
                    <div id='orderSum'>Итого: 0 рублей</div>\
                </div>";
        
        var oliContainer = document.getElementById('orderItems');

        var btnCancel = cmn.createElement("button", "btnCancel", dockElement);
        btnCancel.innerHTML = 'Отменить';
        btnCancel.onclick = aDeleteOrder;

        var btnAcceptOrder = cmn.createElement("button", "btnOk", dockElement);
        btnAcceptOrder.innerHTML = 'Оплатить';
        btnAcceptOrder.onclick = anAcceptOrder;
        
        /**
         * 
         * @param {type} aObject
         * @param {type} aContainer
         * @returns {undefined}
         */
        this.orderItem = function(aObject, aContainer) {
            var itView = this;
            var container = aContainer ? aContainer : oliContainer;
            var divEl = cmn.createElement("div", "orderItem", container);
            var itemName = cmn.createElement("h4", "itemName", divEl);
            var itemCount = cmn.createElement("h4", "itemCount", divEl);

            var btnRemove = cmn.createElement("button", "removeBtn", divEl);
            btnRemove.innerHTML = '<span class="glyphicon glyphicon-minus"></span>';
            btnRemove.className = "removeBtn";

            var btnDelete = cmn.createElement("button", "deleteBtn", divEl);
            btnDelete.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';

            itView.updateText = itView.show = function() {
                itemName.innerHTML = aObject.itemName;
                itemCount.innerHTML = aObject.orderQuantity + ' шт. ' + aObject.orderSum + " р.";
            };

            itView.stop = false;

            itView.delete = function() {
                container.removeChild(divEl);
            };

            divEl.onclick = function() {
                if (!itView.stop)
                    aObject.increase();
                else
                    itView.stop = false;
            };
            
            btnRemove.onclick = function() {
                aObject.decrease();
                itView.stop = true;
            };
            
            btnDelete.onclick = aObject.delete;

            itView.show();
        };
        
        this.updateOrderSummary = function() {
            
        };
    };
    
    var lastAlert = null;
    self.Alerter = function(anAlert, aType, aText, aCloseable, aCloseTimeOut
                            , aContainer, onClick) {
        if (!anAlert) {
            var divEl = cmn.createElement("div", "alert " + aType, 
                                          aContainer ? aContainer : "actionPanel",
                                          null, lastAlert ? lastAlert : false);
            divEl.role = "alert";
            lastAlert = divEl;
        } else {
            divEl = anAlert;
            if (aType)
                divEl.className = "alert " + aType;
        }

        divEl.innerHTML = aText;

        function closeIt() {
            divEl.parentNode.removeChild(divEl);
            if (lastAlert === divEl)
                lastAlert = null;
        }

        divEl.onclick = onClick ? onClick : (aCloseable ? closeIt : null);

        if (aCloseTimeOut)
            setTimeout(closeIt, aCloseTimeOut);

        return divEl;
    };
}
