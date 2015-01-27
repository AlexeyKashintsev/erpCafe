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
        var itemPanel = cmn.createElement("div", "panel panel-primary color " + (!!aData.color ? aData.color : "") , itemContainer);
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
    
    self.priceModifier = function(aContainer, aData, onClick) {
        var mContainer = cmn.createElement("div", "price_modifier pt_"
                + aData.price_type, aContainer, "pt_" + aData.price_type);
        var mDesc = cmn.createElement("h3", "itemDesc", mContainer);
        mDesc.innerHTML = aData.type_name;
        
        mContainer.onClick =  function() {
            onClick(aData);
        };
    };
}
