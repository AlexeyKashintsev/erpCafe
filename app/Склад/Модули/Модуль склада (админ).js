/**
 * @public
 * @author minya92
 * @module
 * TODO Добавить роли
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
    /*
     * Инициализация новых айтемов по умолчанию для нового франчайзе
     */
    self.initItemsForFranchazi = function(aFranchaziId) {
        Logger.info('Начало заполнения стандартными айтемами для франчази ' + aFranchaziId);
        var franchazi = aFranchaziId ? aFranchaziId : 
                (model.listFranchazi.cursor.org_franchazi_id ? 
                    model.listFranchazi.cursor.org_franchazi_id :
                            null);//TODO get it from session
        model.qInsertDefaultItems.params.franchazi_id =
            model.qInsertDefaultItemsContents.params.franchazi_id = 
            model.qInsertDefaultBonusRates.params.franchazi_id = franchazi;
        model.qInsertDefaultItems.executeUpdate();
        model.qInsertDefaultItemsContents.executeUpdate();
        model.qInsertDefaultBonusRates.executeUpdate();
    };
}
