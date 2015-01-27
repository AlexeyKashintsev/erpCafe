/**
 * @public
 * @author minya92
 * @module
 */ 
function WhModuleAdmin() {
    var self = this, model = this.model;
    
    self.addItemContentsToWH =  function(anItem, aTradePoint) {
        model.qContents.params.trade_item_id = anItem;
        model.qContents.requery();
        model.queryItemsInWH.params.warehouse_id = aTradePoint;
        model.queryItemsInWH.execute();
        model.qContents.beforeFirst();
        while (model.qContents.next()) {
            if (model.queryItemsInWH.find(model.queryItemsInWH.schema.item_id, model.qContents.wh_item).length === 0) {
                model.queryItemsInWH.push({
                    warehouse: aTradePoint,
                    item_id: model.qContents.cursor.wh_item
                });
            }
        }
    };
}
