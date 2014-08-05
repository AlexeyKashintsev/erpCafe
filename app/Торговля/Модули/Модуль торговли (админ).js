/**
 * 
 * @author ak
 * @module
 * @public
 * @resident
 */ 
function TradeAdminModule() {
    var self = this, model = this.model;
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
    
    function addNewItemToTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, aCost) {
        if (aFranchazi) franchazi = aFranchazi;
        model.qTIbyTP.push({
                start_date  :   new Date(),
                item_id     :   anItem,
                trade_point_id  :   aTradePoint,
                franchazi_id    :   franchazi,
                item_cost   :   aCost
            });
        addItemComposToWH(anItem, aTradePoint);
    };
    
    function addItemComposToWH(anItem, aTradePoint){
        model.qContents.params.trade_item_id = anItem;
        model.qContents.requery();
        model.qContents.beforeFirst();
        while (model.qContents.next()){
            model.qAddComposeToWH.push({
                warehouse : aTradePoint,
                item_id : model.qContents.cursor.wh_item
            })
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
