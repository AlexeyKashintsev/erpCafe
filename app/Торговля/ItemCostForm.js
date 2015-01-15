/**
 * 
 * @author Work
 */
function ItemCostForm() {
    var self = this, model = this.model, form = this;
    var tradeModule = new ServerModule("TradeAdminModule");
    
    self.setItem = function (anItemId){
        model.qPriceTypeForTradeItem.params.item_id = anItemId;
        model.qPriceTypeForTradeItem.params.actual_date = new Date();
        model.qPriceTypeForTradeItem.params.trade_point = session.tradePoint;
        model.requery();
    };
    
    self.save = function(){
        var itemData = {
            item_id     :   model.qPriceTypeForTradeItem.params.item_id,
            trade_point :   model.qPriceTypeForTradeItem.params.trade_point,
            costs       :   {}
        };
        
        model.qPriceTypeForTradeItem.beforeFirst();
        while (model.qPriceTypeForTradeItem.next()){
            itemData.costs = {
                type_id     :   model.qPriceTypeForTradeItem.cursor.trade_price_types_id,
                item_cost   :   model.qPriceTypeForTradeItem.cursor.item_cost
            };
        };
        
        tradeModule.processChangesForTradeItem(itemData);
        model.qPriceTypeForTradeItem.requery();
    };
}