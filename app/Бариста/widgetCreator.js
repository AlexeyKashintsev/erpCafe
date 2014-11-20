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
    
    self.typeItem = function(aContainer, typeData, onClick) {
        var itemContainer = cmn.createElement("div", "itemDescription tt_"
                + aData.trade_item_type_id + (aData.classtag ? " " + aData.classtag : ""), aContainer);
        //var
    };
}
