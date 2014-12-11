/**
 * @public
 * @author minya92
 * @module
 */
function BonusModule() {
    var self = this, model = this.model;
    var session = Session.get("UserSession"); 
    var bm      = Session.get("BillModule");
    var sender  = Session.get("MessageSender");
    var client  = Session.get("ClientServerModule");
    
    self.setBonusRate = function(anItemId, aTypeId, aBonusRate, aBonusCategory) {
        if(!aBonusCategory) aBonusCategory = 1;
        model.qTradeItemsId.params.item_id = anItemId;
        //model.qTradeItemsId.params.franchazi_id = (session.getUserRole() === "admin") ? null : session.getFranchazi();
        model.requery();
        if (!model.qTradeItemsId.empty && !aTypeId) {
            if (model.qTradeItemsId.cursor.franchazi_id == session.getFranchazi() || session.getUserRole() === "admin") {
                model.qBonusCountForTradeItem.params.trade_item = anItemId;
                model.qBonusCountForTradeItem.requery();
                if(model.qBonusCountForTradeItem.empty){
                    model.qBonusCountForTradeItem.push({
                        bonus_rate: aBonusRate,
                        trade_item: model.qTradeItemsId.cursor.wh_items_id,
                        client_bonus_category: aBonusCategory
                    });
                } else {
                    model.qBonusRateForItemsEdit.cursor.bonus_rate = aBonusRate;
                    model.qBonusRateForItemsEdit.cursor.trade_item = model.qTradeItemsId.cursor.wh_items_id;
                    model.qBonusRateForItemsEdit.cursor.client_bonus_category = aBonusCategory;
                }
            }
        } else {
            if (session.getUserRole() === "admin") {
                model.qBonusCountForTradeItem.push({
                    bonus_rate: aBonusRate,
                    type_id: aTypeId,
                    client_bonus_category: aBonusCategory
                });
            }
        }
        model.save();
    };

    self.clearBonusRate = function(anItemId, aTypeId) {
        model.qBonusCountForTradeItem.params.trade_item = anItemId;
        model.qBonusCountForTradeItem.params.trade_type = aTypeId;
        model.qTradeItemsId.params.item_id = anItemId;
        model.requery();
        if (!model.qTradeItemsId.empty && !aTypeId && !model.qBonusCountForTradeItem.empty) {
            if (model.qTradeItemsId.cursor.franchazi_id == session.getFranchazi() || session.getUserRole() === "admin") {
                while (!model.qBonusCountForTradeItem.empty)
                    model.qBonusCountForTradeItem.deleteRow();
            }
        } else {
            if (session.getUserRole() === "admin" && !model.qBonusCountForTradeItem.empty) {
                while (!model.qBonusCountForTradeItem.empty)
                    model.qBonusCountForTradeItem.deleteRow();
            }
        }
        model.save();
    };
    
    /*
     * Связь биллинговой операции с торговой
     * @param {type} aTradeOperation
     * @param {type} aBillOperation
     * @returns {undefined}
     */
    function connectBillAndTradeOperation(aTradeOperation, aBillOperation){
        if (!!aTradeOperation && !!aBillOperation)
            model.qConnectTradeAndBillOperations.push({
                trade_cashbox_operation: aTradeOperation,
                bill_operation: aBillOperation
            });
    }
    /*
     * Добавление денег франчайзе за попукупку бонусами
     * @param {type} aSum
     * @param {type} aType
     * @param {type} aFranchaziId
     * @returns {@this;@pro;model.qBillOperationsList.cursor.bill_operations_id|Boolean}
     */
    function addCashToFranchazi(aSum, aType, aFranchaziId){
        var franchaziId = aFranchaziId ? aFranchaziId : session.getFranchazi();
        model.qBillAccountServer.params.type = bm.ACCOUNT_TYPE_DEFAULT;
        model.qBillAccountServer.params.franchazi_id = franchaziId;
        model.qBillAccountServer.requery();
        if(model.qBillAccountServer.length > 0){
            var accountId = model.qBillAccountServer.cursor.bill_accounts_id;
            if (aType === "bonus"){
                var multiplier = 0.05;
                return bm.addBillOperation(accountId, bm.OPERATION_ADD_CASH, aSum * multiplier, false, false);
            }
            if (aType === "money")
                return bm.addBillOperation(accountId, bm.OPERATION_ADD_CASH, aSum, false, false);
        } else 
            return false;
    };
    
    /*
     * Проведение бонусной операции и начаисление денег на счет франчайзе
     */
    self.bonusOperation = function(aClient, aBonusOperation, aCount, aTradeOperationId) {
        // Если идет списание средст с бонусного счета клиента, то начислить деньги на счет франчази
        if (aBonusOperation === bm.OPERATION_DEL_BUY) {
            var BillOperation = addCashToFranchazi(aCount, "bonus");
            connectBillAndTradeOperation(aTradeOperationId, BillOperation);
        }
         // Проведение бонусной операции со счетом клиента
        client.setClientCityByPhone(aClient.phone, session.getCityByTradePoint());
        var BillOperation = bm.addBillOperation(aClient.bonusBill, aBonusOperation, aCount);
        connectBillAndTradeOperation(aTradeOperationId, BillOperation);
        if (aBonusOperation === bm.OPERATION_ADD_BONUS){
            sender.sendMessage(sender.BONUS_ADD, {
                username:   aClient.firstName,
                count   :   aCount,
                phone   :   aClient.phone,
                email   :   aClient.email,
                subject :   "Информационное сообщение сети кафе ERP"
            });
        }else if (aBonusOperation === bm.OPERATION_DEL_BUY){
            sender.sendMessage(sender.BONUS_REMOVE, {
                username:   aClient.firstName,
                count   :   aCount,
                phone   :   aClient.phone,
                email   :   aClient.email,
                subject :   "Информационное сообщение сети кафе ERP"
            });
        }
        model.save();
    }; 
    
    /*
     * Получение количества бонусов за товар
     * TODO Переделать, чтобы все возвращалось одним запросом
     * @param {type} anItem
     * @returns {Number|@this;@pro;model.tradeItemCost.cursor.item_cost|@this;@pro;model.qBonusRateForItemsEdit.cursor.bonus_rate|@this;@pro;model.qGetBonusCategories.cursor.category_bonus_rate}
     */
    self.getCountBonusesByItem = function(anItem, aBonusCategory) {
        model.qBonusRateForItemsEdit.params.item_id = anItem;
        model.qBonusRateForItemsEdit.params.bonus_category = aBonusCategory;
        model.qBonusRateForItemsEdit.requery();
        if (model.qBonusRateForItemsEdit.length > 0) {
            return model.qBonusRateForItemsEdit.cursor.bonus_rate / 100;
        } else {
            return getCountBonusesByCategory(model.qBonusRateForItemsEdit.params.bonus_category) / 100;
        }
    };
    
    /*
     * Получение количества бонусов за товар в зависимости от категории пользователя.
     * @param {type} aCatId
     * @returns {@this;@pro;model.qGetBonusCategories.cursor.category_bonus_rate}
     */
    function getCountBonusesByCategory(aCatId) {
        model.qGetBonusCategories.params.category_id = aCatId;
        model.qGetBonusCategories.requery();
        return model.qGetBonusCategories.cursor.category_bonus_rate;
    }
}
