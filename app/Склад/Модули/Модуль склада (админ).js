/**
 * @public
 * @author minya92, Alexey
 * @module
 * TODO Добавить роли
 */ 
function WhModuleAdmin() {
    var self = this, model = this.model;
    var whModule = Session.get("WhSessionModule");
    
    self.addItemContentsToWH = function(anItem, aTradePoint) {
        model.qContents.params.trade_item_id = anItem;
        model.qContents.requery();
        model.queryItemsInWH.params.warehouse_id = aTradePoint;
        model.queryItemsInWH.requery();
        model.qContents.forEach(function(cursor) {
            var foundItems = model.queryItemsInWH.find(model.queryItemsInWH.schema.item_id, cursor.wh_item);
            if (foundItems.length === 0) {
                model.queryItemsInWH.push({
                    trade_point_id: aTradePoint,
                    item_id: cursor.wh_item,
                    wh_item: true
                });
                initStartBalanceForAnItem(cursor.wh_item, aTradePoint);
            } else {
                if (!foundItems[0].wh_item && !foundItems[0].wh_content) {
                    model.queryItemsInWH.scrollTo(model.queryItemsInWH.findById(foundItems[0].trade_items_on_tp_id));
                    model.queryItemsInWH.cursor.wh_item = true;
                    initStartBalanceForAnItem(cursor.wh_item, aTradePoint);
                }
            }
        });
        model.save();
    };
    
    function initStartBalanceForAnItem(anItem, aTradePoint) {
        var session = whModule.getCurrentSession();
        model.querySessionBalance.push({
            session_id  : session,
            item_id     : anItem,
            start_value : 0
        });
    }
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
        model.qInsertDefaultBonusRates.executeUpdate();//Это здесь зачем?
    };
}
