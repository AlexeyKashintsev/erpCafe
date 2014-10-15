/**
 * @rolesAllowed admin franchazi
 * @author ak
 * @module
 * @public
 */ 
function TradeAdminModule() {
    var self = this, model = this.model;
    var franchazi = null;
    var session = Modules.get("UserSession");

    self.OP_TYPE_REMOVE_CASH = 101; // операция снятия кассы

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
    
    function closeItemOnTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, anEndDate) {
        /*if (setTradeItemOnTradePoint(anItem, aTradePoint, aFranchazi)) {
            model.qTIbyTP.beforeFirst();
            while (model.qTIbyTP.next())
                model.qTIbyTP.cursor.end_date = aEndDate ? aEndDate : new Date();
            model.save();
        }*/
        model.prCloseItemCost.params.franchazi_id = aFranchazi;
        model.prCloseItemCost.params.trade_point_id = aTradePoint;
        model.prCloseItemCost.params.item_id = anItem;
        //model.prCloseItemCost.params.stop_date = Date(anEndDate);
        model.prCloseItemCost.executeUpdate();
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
    /*
     * Списание денег с кассы
     * 
     */
    self.takeMoneyFromCashbox = function(aSessionId, aSum, aTradePoint){
        if(!aSessionId){
            model.qLastSessionOnTradePoint.params. trade_point_id = aTradePoint;
            model.qLastSessionOnTradePoint.requery();
            //model.qLastClosedSessionOnTradePoint.executeUpdate();
            aSessionId = model.qLastSessionOnTradePoint.cursor.org_session_id;
        }
        model.getSessions.params.session_id = aSessionId;
        model.getSessions.requery();
        if(model.getSessions.length > 0){
            model.qTradeOperationBySession.insert();
            model.qTradeOperationBySession.cursor.operation_sum = aSum;
            model.qTradeOperationBySession.cursor.operation_date = new Date();
            model.qTradeOperationBySession.cursor.operation_type = self.OP_TYPE_REMOVE_CASH;
            model.qTradeOperationBySession.cursor.session_id = aSessionId;
            model.qTradeOperationBySession.cursor.user_name = session.getUserName();
            model.save();
            return model.qTradeOperationBySession.cursor.trade_cash_box_operation_id;
        } else return false;
    };
}
