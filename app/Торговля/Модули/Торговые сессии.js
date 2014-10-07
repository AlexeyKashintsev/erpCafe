/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function TradeSessions() {
    var self = this, model = this.model;
    var whSession = new WhSessionModule();
    var clientModule = new ClientServerModule();
    var billing = new BillModule();
    var ep = new EventProcessor();
    var session = Modules.get("UserSession");
    var sender = new MessageSender();
    
    /*
     * Типы операций
     * Деньги: 0
     * Бонусы: 1
     * Безнал: 10
     */
    var PAYMENT_TYPE_MONEY =  0;
    var PAYMENT_TYPE_BONUS = 1;
    var PAYMENT_TYPE_CARD = 10;
    
    /*
     * �?нициализация сессии
     * @param {type} aSession
     * @param {type} aStartBalance
     * @returns {undefined}
     */
    self.initializeSession = function(aSession, aStartBalance) {
        if (!aSession) {
            aSession = session.getActiveTPSession();
        };

        model.qTradeSessionBalance.push({
            session_id  :   aSession,
            start_value :   aStartBalance
        });
        model.params.session_id = aSession;
        ep.addEvent('newSession', {
            session :   aSession,
            module  :   'TradeSessions',
            startB  :   aStartBalance
        });
        model.save();
    };
    
  /*
   * Получение текущей сессии
   * @returns {@this;@pro;model.qOpenedSession.org_session_id}
   */
    function getCurrentSession(){
        model.qOpenedSession.params.user_name = self.principal.name;
        model.qOpenedSession.execute();
        ep.addEvent('openSession', {
            session :   model.qOpenedSession.org_session_id,
            module  :   'TradeSessions'
        });
        if (model.qOpenedSession.org_session_id)
            whSession.setCurrentSession(model.qOpenedSession.org_session_id);
        return model.qOpenedSession.org_session_id;
    }
    
    function TradeOperationAddToCashBox(anOrderSum, anOperationType, aClientId){
        model.qTradeOperationBySession.push({
            operation_sum    : anOrderSum,
            operation_date   : new Date(),
            session_id       : model.params.session_id,
            operation_type   : anOperationType,
            client_id        : aClientId
        });
        return model.qTradeOperationBySession.trade_cash_box_operation_id;
    }
    
    /*
     * @param {type} aCashBoxOperationId
     * @param {type} anItemId
     * @param {type} aQuantity
     * @returns {undefined}
     */
    function TradeItemsPushInTradeOperation(aCashBoxOperationId, anItemId, aQuantity){
        model.qTradeOperationsWithItems.push({
            cash_box_operation : aCashBoxOperationId,
            trade_item : anItemId,
            items_quantity : aQuantity
        });
    }
    
    
    /*
     * Расчет потребления складских позиций
     * @param {type} anItemId
     * @param {type} aQuantity
     * @returns {Array}
     */
    function WhItemsConsumption (anItemId, aQuantity, aTradeOperationId){
        var WhItemsConsump = [];
        model.qContents.params.trade_item_id = anItemId;
        model.qContents.execute();
        model.qContents.beforeFirst();
        while (model.qContents.next()){
            if (WhItemsConsump[model.qContents.cursor.wh_item]){///Что-то здесь поправил!!!!! TODO Проверить
                WhItemsConsump[model.qContents.cursor.wh_item] += model.qContents.cursor.usage_quantity * aQuantity;
            } else {
                WhItemsConsump[model.qContents.cursor.wh_item] = model.qContents.cursor.usage_quantity * aQuantity;
            }
        }
        if (WhItemsConsump.length > 0)
            try {
                whSession.whMovement(WhItemsConsump, whSession.WH_PRODUCE_ITEMS);
            } catch (e) {
                ep.addEvent('errorAddTradeOperation', {
                    desk    : 'Ошибка при добавлении расхода товара на склад(er#tr108)',
                    opID    : aTradeOperationId,
                    iID     : anItemId
                });
            }
        else {
                ep.addEvent('errorAddTradeOperation', {
                    desk    : 'Не указан состав товара(er#tr115)',
                    opID    : aTradeOperationId,
                    iID     : anItemId
                });
            }
    }
    
    //TODO Написать функцию возвращающую список всех товаров на точке со всем и возможными бонусами
    //Обращение к БД всего один раз + передача списка доступных товаров на сторону клента (см tradeItemsByTradePointWithCost)
    
    /*
     * Получение количества бонусов за товар
     * @param {type} anItem
     * @returns {Number|@this;@pro;model.tradeItemCost.cursor.item_cost|@this;@pro;model.qBonusRateForItemsEdit.cursor.bonus_rate|@this;@pro;model.qGetBonusCategories.cursor.category_bonus_rate}
     */
    function getCountBonusesByItem(anItem, aBonusCategory){
        model.qBonusRateForItemsEdit.params.item_id = anItem;
        model.qBonusRateForItemsEdit.params.bonus_category = aBonusCategory;
        model.qBonusRateForItemsEdit.requery();
        if (model.qBonusRateForItemsEdit.length > 0){
            return model.qBonusRateForItemsEdit.cursor.bonus_rate;
        } else {
            model.qOpenedSession.params.user_name = self.principal.name;
            model.tradeItemCost.params.date_id = new Date();
            model.tradeItemCost.params.item_id = anItem;
            model.tradeItemCost.params.trade_point_id = model.qOpenedSession.cursor.trade_point;
            model.tradeItemCost.requery();
            return model.tradeItemCost.cursor.item_cost * getCountBonusesByCategory(model.qBonusRateForItemsEdit.params.bonus_category) / 100;
        }
    }
    /*
     * Получение количества бонусов за товар в зависимости от категории пользователя.
     * @param {type} aCatId
     * @returns {@this;@pro;model.qGetBonusCategories.cursor.category_bonus_rate}
     */
    function getCountBonusesByCategory(aCatId){
        model.qGetBonusCategories.params.category_id = aCatId;
        model.qGetBonusCategories.requery();
        return model.qGetBonusCategories.cursor.category_bonus_rate;
    }
    
    /*
     * Запись проданных товаров в торговую операцию
     * @param {type} anOrderItem
     * @param {type} aTradeOperationId
     * @returns {Boolean}
     */
    function processOrderItem(anOrderItem, aTradeOperationId) {
        if (anOrderItem.itemId && anOrderItem.quantity){
            TradeItemsPushInTradeOperation( aTradeOperationId, 
                                            anOrderItem.itemId, 
                                            anOrderItem.quantity);
                                            
            WhItemsConsumption(anOrderItem.itemId, anOrderItem.quantity);
        } else {
            ep.addEvent('errorAddTradeOperation', {
                desk    : 'Не указано количество или ID товара(er#170)',
                opID    : aTradeOperationId
            });
        }
    }
    /*
     * TODO Описать подробнее что эта чтука делает, Здесь она точно нужна?
     * @param {type} aTradeOperation
     * @param {type} aBillOperation
     * @returns {undefined}
     */
    function connectBillAndTradeOperation(aTradeOperation, aBillOperation){
        model.qConnectTradeAndBillOperations.push({
            trade_cashbox_operation: aTradeOperation,
            bill_operation: aBillOperation
        });
    }
    
    /*
     * Процесс продажи
     * @param {type} anOrderDetails
     * @returns {String}
     */
    self.processOrder = function(anOrderDetails){
        var client = false;
        if (!model.params.session_id){
            model.params.session_id = getCurrentSession();
        }
        
        if (anOrderDetails.clientData)
            client = clientModule.getClientDataByPhone(anOrderDetails.clientData.phone);
        
        //При внесении операции после окончания серверной сессии
        if (!model.params.session_id && session.checkSession(anOrderDetails.session_id)) {
            model.params.session_id = anOrderDetails.session_id;
            whSession.setCurrentSession(anOrderDetails.session_id);
        }
        
        if (model.params.session_id){
            switch (anOrderDetails.methodOfPayment){
                case "money":
                    var BonusCount = 0;
                    var BonusOperation = billing.OPERATION_ADD_BONUS;
                    var OperationType = PAYMENT_TYPE_MONEY;
                    break;
                case "bonus":
                    BonusOperation = billing.OPERATION_DEL_BUY;
                    OperationType = PAYMENT_TYPE_BONUS;
                    BonusCount = anOrderDetails.orderSum;
                    if (client.bonusBill.length > 0) {
                      if (client.bonusCount < anOrderDetails.orderSum){
                          ep.addEvent('errorNotEnoughBonuses', anOrderDetails);
                          return "error";
                      }
                    }
                    break;
                default:
                    ep.addEvent('errorMethodOfPaymentIsNull', anOrderDetails);
                    return "error";
            }
            
            var TradeOperationId = TradeOperationAddToCashBox(  anOrderDetails.orderSum,
                                                                OperationType,
                                                                client ? client.bonusBill : null);
            for (var i in anOrderDetails.orderItems) {
                processOrderItem(anOrderDetails.orderItems[i], TradeOperationId);
                
                if (client && anOrderDetails.methodOfPayment === "money") {
                    BonusCount += getCountBonusesByItem(anOrderDetails.orderItems[i].itemId, client.bonusCategory)
                                  * anOrderDetails.orderItems[i].quantity;
                }
            }                    
            model.save();
            
            if (client.bonusBill) {
                billing.bonusOperation(client, BonusOperation, BonusCount, TradeOperationId);
            }
            
        };
    };
}
