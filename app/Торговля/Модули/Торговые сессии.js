/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function TradeSessions() {
    var self = this, model = P.loadModel(this.constructor.name);
    var whSession = new WhSessionModule();
    //var clientModule = new ClientServerModule();
    //var billing = new BillModule();
    var ep = new EventProcessor();
    var ClientPhone = null;
    var tradeOperationType = "money";
    
    self.setClientPhone = function(aPhone){//TODO Убрать в модуль работы с клиентами
        ClientPhone = aPhone;
    };
    
    self.setTradeOperationType = function(aType){//TODO Зло^ использовать меч света
        tradeOperationType = aType;
    };
    
    self.getBonusCount = function(){//TODO Тоже самое
        var perem = billing.getSumFromUserId(ClientPhone);//Сонный индус писал?
        return billing.getSumFromUserId(ClientPhone);
    };
    
    self.initializeSession = function(aSession, aStartBalance) {
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

  
    function getCurrentSession(){
        model.qOpenedSession.params.user_name = P.principal.name;
        model.qOpenedSession.execute();
        ep.addEvent('openSession', {
            session :   model.qOpenedSession.cursor.org_session_id,
            module  :   'TradeSessions'
        });
        model.params.session_id = model.qOpenedSession.cursor.org_session_id;
        whSession.setCurrentSession(model.params.session_id);
        return model.params.session_id;
    }
    
    function TradeOperationAddToCashBox(anOrderSum, aClientId){
        model.qTradeOperationBySession.push({
            operation_sum    : anOrderSum,
            operation_date   : new Date(),
            session_id       : model.params.session_id,
            operation_type   : null, //TODO Поменять тип операции
            client_id        : aClientId
        return model.qTradeOperationBySession.cursor.trade_cash_box_operation_id;
    }
    
    function TradeItemsAddToTradeOperation(aCashBoxOperationId, anItemId, aQuantity){
        model.qTradeOperationsWithItems.push({
            cash_box_operation : aCashBoxOperationId,
            trade_item : anItemId,
            items_quantity : aQuantity
        });
    }
    
    
    /*
     * Расчет потребления складских позиций
     */
    function WhItemsCalculation (anItemId, aQuantity){
        var WhItems = [];
        model.qContents.params.trade_item_id = anItemId;
        model.qContents.execute();
        model.qContents.beforeFirst();
        while (model.qContents.next()){
            if (WhItems[model.qContents.cursor.wh_item]){///Что-то здесь поправил!!!!! TODO Проверить
                WhItems[model.qContents.cursor.wh_item] += model.qContents.cursor.usage_quantity * aQuantity;
            } else {
                WhItems[model.qContents.cursor.wh_item] = model.qContents.cursor.usage_quantity * aQuantity;
            }
        }
        return WhItems;
    }
    
    //TODO Написать функцию возвращающую список всех товаров на точке со всем и возможными бонусами
    //Обращение к БД всего один раз + передача списка доступных товаров на сторону клента (см tradeItemsByTradePointWithCost)
    
    function getCountBonusesByItem(anItem){
        model.qBonusRateForItemsEdit.params.item_id = anItem;
        model.qBonusRateForItemsEdit.params.bonus_category = clientModule.getBonusCategory(ClientPhone);
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
    
    function getCountBonusesByCategory(aCatId){
        model.qGetBonusCategories.params.category_id = aCatId;
        model.qGetBonusCategories.requery();
        return model.qGetBonusCategories.cursor.category_bonus_rate;
    }
    
    //Запись прихода по кассе
    self.processOrder = function(anOrderDetails){
        if (!model.params.session_id){
            getCurrentSession();
        }
        //TODO написать всю программу на русском языке, убрать все что не начинается с //
        // Если мы в сессии,то
        if (model.params.session_id){
            if (tradeOperationType === "money"){
                var BonusCount = 0;
                var TradeOperationId = TradeOperationAddToCashBox(anOrderDetails.orderSum);//, clientModule.getBonusBill(ClientPhone));
                // для всех товаров
                for (var i in anOrderDetails.orderItems) {
                    if (anOrderDetails.orderItems[i].itemId && anOrderDetails.orderItems[i].quantity){
                        // записать проданные товары в тороговую операцию. При этом добавив приход в кассу.
                        TradeItemsAddToTradeOperation(TradeOperationId, anOrderDetails.orderItems[i].itemId, anOrderDetails.orderItems[i].quantity);
                        // TODO Добавить добавление бонусов клиенту на его счет.
                        if (ClientPhone){
                            BonusCount += getCountBonusesByItem(anOrderDetails.orderItems[i].itemId) * anOrderDetails.orderItems[i].quantity;
                        }// затем написать уход элементов состава товара со склада. 
                        var calculatedConsumption = WhItemsCalculation(anOrderDetails.orderItems[i].itemId, anOrderDetails.orderItems[i].quantity);
                        var whMovementResult = whSession.whMovement(calculatedConsumption, whSession.WH_PRODUCE_ITEMS);
                        if (!whMovementResult) {
                            ep.addEvent('errorAddTradeOperation', anOrderDetails);
                        }
                    }
                }
                if (ClientPhone){
                    billing.addBillOperation(clientModule.getBonusBill(ClientPhone), billing.OPERATION_ADD_BONUS, BonusCount);
                }
            model.save();
            }/* else if (tradeOperationType === "bonus"){ //Оплата бонусами
                //Получаем информацию о состоянии бунусного счета клиента
                model.qBillAccount.params.user_id = ClientPhone;
                model.qBillAccount.requery();
                if (model.qBillAccount.length > 0){
                    //Если на счету достаточно бонусов
                    if (model.qBillAccount.cursor.currnt_sum >= anOrderDetails.orderSum){
                        //Добавляем нулевой приход в кассу
                        var TradeOperationId = TradeOperationAddToCashBox(0);
                        //Списываем все товары. Выполняем продажу.
                        for (var i in anOrderDetails.orderItems) {
                            if (anOrderDetails.orderItems[i].itemId && anOrderDetails.orderItems[i].quantity){
                                // записать проданные товары в тороговую операцию.
                                TradeItemsAddToTradeOperation(TradeOperationId, anOrderDetails.orderItems[i].itemId, anOrderDetails.orderItems[i].quantity);
                                // затем написать уход элементов состава товара со склада. 
                                if (!whSession.whMovement(WhItemsCalculation(anOrderDetails.orderItems[i].itemId, anOrderDetails.orderItems[i].quantity), whSession.WH_PRODUCE_ITEMS)){
                                    //если не получилось - вывести ошибку.
                                    ep.addEvent('errorAddTradeOperation', anOrderDetails);
                                }
                            }
                        }
                        //Снимаем бонусы со счета
                       
                        billing.addBillOperation(clientModule.getBonusBill(ClientPhone), billing.OPERATION_DEL_BUY, anOrderDetails.orderSum);
                        //TODO !!Дописать добавление бонусов на счет франчайзи.!!!!
                        model.save();
                    }
                }
            }*/
        }
    };
}
