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

    /**** Управление ценой на товар *****/

    function findItemOnTP(anItemId, aTradePoint) {
        model.qTradeItemsOnTP.params.trade_point = aTradePoint;
        model.qTradeItemsOnTP.params.item_id = null;
        model.qTradeItemsOnTP.requery();
        var item = model.qTradeItemsOnTP.find(model.qTradeItemsOnTP.schema.item_id, anItemId);
        return item[0] ? item[0].items_on_tp_id : null;
    }

    /*
     * Добавление или изменение цен на товар из обекта вида:
     * {item_id, trade_point, costs : {price_type, cost}, delete, trade_item, wh_content, wh_item, color}
     */
    self.processChangesForTradeItem = function(itemData) {
        var itemOnTP = findItemOnTP(itemData.item_id, itemData.trade_point);
        var added = false;
        
        if (!itemOnTP) {
            itemOnTP = addItemToTP(itemData.item_id, itemData.trade_point);
            added = true;
        }

        if (itemData.wh_content || itemData.trade_item || itemData.wh_item || itemData.color) {
            var curs = model.qTradeItemsOnTP.findById(itemOnTP);
            curs.wh_content = itemData.wh_content;
            curs.trade_item = itemData.trade_item;
            curs.wh_item = itemData.wh_item;
            curs.color = itemData.color;
            curs.trade_point_id = itemData.trade_point;
        }
        if (!itemData.delete) {
            for (var price_type in itemData.costs) {
                if (itemData.costs[price_type])
                    setCost4TradeItemOnTradePoint(itemOnTP, itemData.costs[price_type], price_type);
            }
            if (curs.wh_content) {
                whModule.addItemContentsToWH(curs.item_id, curs.trade_point_id);
            }
        } else {
            deleteItemFromTP(itemOnTP, itemData.trade_point);
        }

        model.save();

        if (added)
            model.requery();

        return true;
    };

    function setCost4TradeItemOnTradePoint(anItemOnTP, aCost, aPriceType) {
        closeTradeItemCost(anItemOnTP, aPriceType);
        if (aCost)
            model.qItemOnTPCosts.push({
                start_date: new Date(),
                item_on_tp: anItemOnTP,
                item_cost: aCost,
                price_type: aPriceType
            });
    }
    ;

    function closeTradeItemCost(anItemOnTp, aPriceType) {
        model.prCloseItemCost.params.item_on_tp = anItemOnTp;
        model.prCloseItemCost.params.price_type = aPriceType;
        model.prCloseItemCost.params.stop_date = new Date();
        model.prCloseItemCost.executeUpdate();
    }
    ;

    function addItemToTP(anItemId, aTradePoint) {
        
        model.qTradeItemsOnTP.push({
            item_id : anItemId,
            trade_point_id : aTradePoint
        });
        return model.qTradeItemsOnTP.cursor.items_on_tp_id;
    }

    function deleteItemFromTP(anItemOnTp) {
        closeTradeItemCost(anItemOnTp, null);
        var row = model.qTradeItemsOnTP.findById(anItemOnTp);
        if (row) {
            model.qTradeItemsOnTP.scrollTo(row);
            model.qTradeItemsOnTP.cursor.closed = true;
        }
    }
}
