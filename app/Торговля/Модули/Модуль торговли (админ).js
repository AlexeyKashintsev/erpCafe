/**
 * @rolesAllowed admin franchazi barista
 * @author ak
 * @module
 * @public
 * TODO УБРАТЬ БАРИСТУ!!!
 */
function TradeAdminModule() {
    var self = this, model = this.model;
    var franchazi = null;
    var session = Session.get("UserSession");
    var whModule = Session.get("WhModuleAdmin");

    self.OP_TYPE_REMOVE_CASH = 101; // операция снятия кассы

    //Возвращает true, если на точке или франшизе есть записи
    function setTradeItemOnTradePoint(anItem, aTradePoint, aFranchazi, aDate) {
        if (aFranchazi)
            franchazi = aFranchazi;
        model.qTIbyTP.params.actual_date = aDate ? aDate : new Date();
        model.qTIbyTP.params.franchazi_id = franchazi;
        model.qTIbyTP.params.item_id = anItem;
        model.qTIbyTP.params.trade_point_id = aTradePoint;
        model.qTIbyTP.execute();
        return (model.qTIbyTP.length !== 0);
    }

    function addItemToTradePoint(anItemId, aTradePointId, aCost) {
        model.qAddTradeItemsOnTP.insert();
        model.qAddTradeItemsOnTP.cursor.item_id = anItemId;
        model.qAddTradeItemsOnTP.cursor.trade_point_id = aTradePointId;
        model.qTIbyTP.push({
            start_date: new Date(),
            item_on_tp: model.qAddTradeItemsOnTP.cursor.trade_items_on_tp_id,
            item_cost: aCost
        });
        model.save();
    }

    function addNewItemToTP(anItemId, aTradePoint, aFranchazi, aCost) {
        if (aFranchazi && !aTradePoint) {
            franchazi = aFranchazi;
            model.listTradePoints.params.franchazi_id = franchazi;
            model.listTradePoints.requery();
            model.listTradePoints.beforeFirst();
            while (model.listTradePoints.next()) {
                addItemToTradePoint(anItemId, model.listTradePoints.cursor.org_trade_point_id, aCost);
                whModule.addItemContentsToWH(anItemId, model.listTradePoints.cursor.org_trade_point_id);
            }
        } else {
            addItemToTradePoint(anItemId, aTradePoint, aCost, aFranchazi);
            whModule.addItemContentsToWH(anItemId, aTradePoint);
        }
    }

    function closeItemOnTradePointOrFranchazi(anItem, aTradePoint, aPriceType) {
        model.prCloseItemCost.params.item_on_tp = null;
        model.prCloseItemCost.params.trade_point_id = aTradePoint;
        model.prCloseItemCost.params.item_id = anItem;
        model.prCloseItemCost.params.price_type = aPriceType;
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

    self.setCost4TradeItemOnTradePointOrFranchzi = function(anItem, aTradePoint, aFranchazi, aCost, aPriceType) {
        if (aTradePoint) {
            closeItemOnTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, aPriceType);
            addNewItemToTP(anItem, aTradePoint, aFranchazi, aCost);
            model.save();
        } else {
            model.listTradePoints.params.franchazi_id = aFranchazi;
            model.listTradePoints.requery();
            model.listTradePoints.beforeFirst();
            while (model.listTradePoints.next()) {
                self.setCost4TradeItemOnTradePointOrFranchzi(anItem, model.listTradePoints.cursor.org_trade_point_id, aFranchazi, aCost, aPriceType);
            }
        }
    };

    self.setEndDateForTradeItem = function(anItem, aTradePoint, aFranchazi, aEndDate, aPriceType) {
        closeItemOnTradePointOrFranchazi(anItem, aTradePoint, aFranchazi, aEndDate, aPriceType);
        model.save();
    };
    /*
     * Списание денег с кассы
     * 
     */
    self.takeMoneyFromCashbox = function(aSessionId, aSum, aTradePoint) {
        if (!aSessionId) {
            model.qOpenedOrLastSession.params.trade_point = aTradePoint;
            model.qOpenedOrLastSession.requery();
            aSessionId = model.qOpenedOrLastSession.cursor.org_session_id;
        }
        model.getSessions.params.session_id = aSessionId;
        model.getSessions.requery();
        if (model.getSessions.length > 0) {
            model.qTradeOperationBySession.push({
                operation_sum: aSum,
                operation_date: new Date(),
                operation_type: self.OP_TYPE_REMOVE_CASH,
                session_id: aSessionId,
                user_name: session.getUserName()
            });
            model.save();
            return model.qTradeOperationBySession.cursor.trade_cash_box_operation_id;
        } else
            return false;
    };

    /*
     * Добавление или изменение цен на товар из обекта вида:
     * {item_id, trade_point, wh_apperance, costs : {price_type, cost, delete}}
     */
    self.processChangesForTradeItem = function(itemData) {
        if(itemData.costs){
            for (var price_type in itemData.costs) {
                if(itemData.costs[price_type].delete) {
                    deleteItemFromTP(itemData.item_id, itemData.trade_point);
                } else {
                    closeItemOnTradePointOrFranchazi(itemData.item_id, itemData.trade_point, price_type);
                    addItemToTP(itemData.trade_point, itemData.item_id, itemData.costs[price_type], price_type);
                }
            }
        }  
    };
    
    function addItemToTP(aTradePoint, aItemId, aCost, aPriceType){
        model.qAddTradeItemsOnTP.params.trade_point = aTradePoint;
        model.qAddTradeItemsOnTP.params.item_id = aItemId;
        model.requery();
        
        if(model.qAddTradeItemsOnTP.empty) {
            model.qAddTradeItemsOnTP.insert();
            model.qAddTradeItemsOnTP.cursor.item_id = aItemId;
            model.qAddTradeItemsOnTP.cursor.trade_point_id = aTradePoint;
        } else if(model.qAddTradeItemsOnTP.cursor.closed) {
            model.qAddTradeItemsOnTP.cursor.closed = false;
        } 
        model.qTIbyTP.push({
            start_date  : new Date(),
            item_on_tp  : model.qAddTradeItemsOnTP.cursor.trade_items_on_tp_id,
            item_cost   : aCost,
            price_type  : aPriceType
        });
        model.save();
    }
    
    function deleteItemFromTP(anItem, aTradePoint){
        model.qAddTradeItemsOnTP.params.trade_point = aTradePoint;
        model.qAddTradeItemsOnTP.params.item_id = anItem;
        model.requery();
        
        model.prCloseItemCost.params.item_on_tp = model.qAddTradeItemsOnTP.cursor.trade_items_on_tp_id;
        model.prCloseItemCost.executeUpdate();
        
        model.qAddTradeItemsOnTP.params.trade_point = aTradePoint;
        model.requery();
        
        if(!model.qAddTradeItemsOnTP.empty) {
            model.qAddTradeItemsOnTP.cursor.closed = true;
        }
    }
}
