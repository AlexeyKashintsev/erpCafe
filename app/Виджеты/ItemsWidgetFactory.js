/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function ItemsWidgetFactory() {
    var self = this, model = this.model;
    
    self.tradeItem = function(aContainer, aData, onClick) {
        var itemContainer = cmn.createElement("div", "Sortable itemDescription tt_"
            + aData.trade_item_type_id + (aData.classtag ? " " + aData.classtag : ""),
            aContainer, "tt_" + aData.item_id);
        var itemPanel = cmn.createElement("div", "panel panel-primary " + aData.color , itemContainer);
        
        var itemContent = cmn.createElement("div", "panel-body", itemPanel);
        var itemDesc = cmn.createElement("h3", "itemDesc", itemContent);
        var itemCost = cmn.createElement("h1", "itemCost", itemContent);
        
        itemDesc.innerHTML = aData.item_name;
        
        this.setDisplayedPrice = function(aPrice) {
            itemCost.innerHTML = aPrice;
        };
        
        itemPanel.onclick = function() {
                onClick(aData);
        };
    };
    
    self.priceModifier = function(aContainer, aData, onClick) {
        var mContainer = cmn.createElement("div", "price_modifier pt_"
                + aData.price_type, aContainer, "pt_" + aData.price_type);
        var mDesc = cmn.createElement("h3", "price_desc", mContainer);
        mDesc.innerHTML = aData.type_name;
        
        mContainer.onclick =  function() {
            onClick(aData);
        };
    };
}
