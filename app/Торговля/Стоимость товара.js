/**
 * 
 * @author Work
 */
function ItemCostForm() {
    var self = this, model = this.model, form = this;
    var tradeModule = new ServerModule("TradeAdminModule");

    self.setItem = function(anItemId) {
        model.qPriceTypeForTradeItem.params.item_id = anItemId;
        model.qPriceTypeForTradeItem.params.actual_date = new Date();
        model.qPriceTypeForTradeItem.params.trade_point = session.tradePoint;
        model.requery();
    };

    self.save = function(aDelItem) {
        var itemData = {
            item_id: model.qPriceTypeForTradeItem.params.item_id,
            trade_point: model.qPriceTypeForTradeItem.params.trade_point,
            costs: {},
            delete: aDelItem
        };

        model.qPriceTypeForTradeItem.forEach(function(aCursor) {
            itemData.costs[aCursor.trade_price_types_id] = aCursor.item_cost;
        });

        tradeModule.processChangesForTradeItem(itemData, function() {
            model.qPriceTypeForTradeItem.params.actual_date = new Date();
            model.qPriceTypeForTradeItem.requery();
        });
    };
}