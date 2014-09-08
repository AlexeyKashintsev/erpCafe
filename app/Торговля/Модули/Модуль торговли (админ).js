/**
 * 
 * @author ak
 * @module
 * @public
 */ 
function TradeAdminModule() {
    var self = this, model = P.loadModel(this.constructor.name);
    var franchazi = null;
    
    //Возвращает true, если на точке или франшизе есть записи
    function setTradeItemOnTradePoint(anItem, aTradePoint, aFranchazi, aDate) {
        if (aFranchazi) franchazi = aFranchazi;
        model.qTIbyTP.params.actual_date = aDate ? aDate : new Date();
        model.qTIbyTP.params.franchazi_id = franchazi;
        model.qTIbyTP.params.item_id = anItem;
        model.qTIbyTP.params.trade_point_id = aTradePoint;
        model.qTIbyTP.execute();
        return (model.qTIbyTP.length !== 0);
    }
    
    function pushItemInTradePoint(anItem, aTradePointId, aCost, aFranchazi){
        model.qTIbyTP.push({
            start_date  :   new Date(),
            item_id     :   anItem,
            trade_point_id  :   aTradePointId,
            franchazi_id    :   aFranchazi,
            item_cost   :   aCost
        });
    }
    
    function addNewItemToTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, aCost) {
        if (aFranchazi && !aTradePoint) {
            franchazi = aFranchazi;
            model.listTradePoints.params.franchazi_id = franchazi;
            model.listTradePoints.requery();
            model.listTradePoints.beforeFirst();
            while (model.listTradePoints.next()){
                pushItemInTradePoint(anItem, model.listTradePoints.cursor.org_trade_point_id, aCost, franchazi);
                addItemContentsToWH(anItem, model.listTradePoints.cursor.org_trade_point_id);
            }
        } else {
            pushItemInTradePoint(anItem, aTradePoint, aCost, franchazi);
            addItemContentsToWH(anItem, aTradePoint);
        }
    };
    
    function addItemContentsToWH(anItem, aTradePoint){
        model.qContents.params.trade_item_id = anItem;
        model.qContents.requery();
        model.queryItemsInWH.params.warehouse_id = aTradePoint;
        model.queryItemsInWH.execute();
        model.qContents.beforeFirst();
        while (model.qContents.next()){
            if (model.queryItemsInWH.find(model.queryItemsInWH.schema.item_id, model.qContents.wh_item).length === 0){
                model.queryItemsInWH.push({
                    warehouse : aTradePoint,
                    item_id : model.qContents.cursor.wh_item
                });
            }
        }
    }
    
    function closeItemOnTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, aEndDate) {
        if (setTradeItemOnTradePoint(anItem, aTradePoint, aFranchazi)) {
            model.qTIbyTP.beforeFirst();
            while (model.qTIbyTP.next())
                model.qTIbyTP.cursor.end_date = aEndDate ? aEndDate : new Date();
        }
    }
    /*
     * При указании торговой точки будет добавлена на торговую точку,
     * при указании только франчази, будет добавлена к франчази,
     * Если для торговой точки не указана цена, но в списке присутствует,
     * будет использоваться цена франчази, или, если ее нет, общая цена
     */
    /*self.addTradeItemToTradePointOrFranchazi = function(anItem, aTradePoint, aFranchazi) {
        if (!setTradeItemOnTradePoint(anItem, aTradePoint, aFranchazi)) {
            addNewItemToTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, null);
            model.save();
            return true;
        } else
            return false;
    };*/
    /*
     * TO DO Добавить обход остальных торговых точек точек франчази, если не указана торговая точка
     */
    self.setCost4TradeItemOnTradePointOrFranchzi = function(anItem, aTradePoint, aFranchazi, aCost) {
        closeItemOnTradePointOrFranchazi(anItem, aTradePoint, aFranchazi);
        addNewItemToTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, aCost);
        model.save();
    };
    
    self.setEndDateForTradeItem = function(anItem, aTradePoint, aFranchazi, aEndDate) {
        closeItemOnTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, aEndDate);
        model.save();
    };
}
