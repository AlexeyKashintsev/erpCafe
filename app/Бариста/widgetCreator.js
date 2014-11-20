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
        var itemType = cmn.createElement("p", "itemType", itemContent);
        var itemCost = cmn.createElement("h1", "itemCost", itemContent);
        

        itemDesc.innerHTML = aData.item_name;
        itemType.innerHTML = aData.type_name;
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
}
