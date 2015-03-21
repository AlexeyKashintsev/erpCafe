/**
 * 
 * @author Work
 */
function ItemCostForm() {
    var self = this, model = this.model, form = this;
    var tradeModule = new ServerModule("TradeAdminModule");

    self.setItem = function(anItemOnTpId) {
        model.qPriceTypeForTradeItem.params.items_on_tp = anItemOnTpId;
        model.qPriceTypeForTradeItem.params.actual_date = new Date();
        model.qPriceTypeForTradeItem.params.trade_point = session.tradePoint;
        model.requery();
    };

    self.save = function() {
        var itemData = {
            item_id: model.qPriceTypeForTradeItem.params.item_id,
            trade_point: model.qPriceTypeForTradeItem.params.trade_point,
            costs: {}
        };

        model.qPriceTypeForTradeItem.forEach(function(aCursor) {
            if (!aCursor.item_cost)
                itemData.costs[aCursor.trade_price_types_id] = 0;
            else
                itemData.costs[aCursor.trade_price_types_id] = aCursor.item_cost;
        });

        tradeModule.processChangesForTradeItem(itemData, function() {
            model.qPriceTypeForTradeItem.params.actual_date = new Date();
            model.qPriceTypeForTradeItem.requery();
        });
    };
    
    self.getCosts = function() {
        var costs = {};
        model.qPriceTypeForTradeItem.forEach(function(aCursor) {
            if (!aCursor.item_cost)
                costs[aCursor.trade_price_types_id] = 0;
            else
                costs[aCursor.trade_price_types_id] = aCursor.item_cost;
        });
        return costs;
    };
}