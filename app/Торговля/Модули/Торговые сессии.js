/**
 * 
 * @author Alexey
 * @module
 * @public
 */
function TradeSessions() {
    Session.setModule('TradeSessions', this);
    var self = this, model = this.model;
    var whSession = Session.getModule('WhSessionModule');
    var bonuses = Session.getModule('BonusModule');
    var odp = new OrderProcessorServer();
    var ep = new EventProcessor();
    var session = Session.getModule("UserSession");
    var sessionItems = {};

    self.getInfoForErrors = function(anError) {
        switch (anError) {
            case 1 :
                return "Несовпадение суммы операции на клиенте и на сервере";
            case 2 :
                return "Недостаточно бонусов для оплаты бонусами";
        }
    };

    /*
     * Инициализация сессии
     * @param {type} aSession
     * @param {type} aStartBalance
     * @returns {undefined}
     */
    self.initializeSession = function(aSession, aStartBalance) {
        if (aSession === session.getActiveTPSession()) {
            //aSession = session.getActiveTPSession();
        //};
            model.qTradeSessionBalance.push({
                session_id: aSession,
                start_value: aStartBalance ? aStartBalance : 0
            });
            model.params.session_id = aSession;
            ep.addEvent('newSession', {
                session: aSession,
                module: 'TradeSessions',
                startB: aStartBalance ? aStartBalance : 0
            });
            model.save();
        } else {
            Logger.warning('Ошибка при инициализации сессии');
        }
    };

    self.calculateFinalValues = function(aSession) {
        if (!aSession) {
            aSession = model.params.session_id ? model.params.session_id :
                                                    getCurrentSession();
        };
        Logger.info('Закрытие сессии ' + aSession);
        model.prSetFinalBalance4CashBox.params.session_id = aSession;
        model.prSetFinalBalance4CashBox.executeUpdate();
    };

    /*
     * Получение текущей сессии
     * @returns {@this;@pro;model.qOpenedSession.org_session_id}
     */
    function getCurrentSession() {
        model.qOpenedSession.params.user_name = session.getUserName();
        model.qOpenedSession.execute();
        ep.addEvent('openSession', {
            session: model.qOpenedSession.org_session_id,
            module: 'TradeSessions'
        });
        if (model.qOpenedSession.org_session_id) {
            whSession.setCurrentSession(model.qOpenedSession.org_session_id);
            model.params.session_id = model.qOpenedSession.org_session_id;
            getTradeItemsByTradePointWithCostAndBonuses();
        }
        return model.params.session_id;
    }

    function getTradeItemsByTradePointWithCostAndBonuses(){
        model.tradeItemsByTPwCost.params.actual_date = new Date();
        //model.tradeItemsByTradePointWithCost.params.franchazi_id = session.getFranchazi();
        model.tradeItemsByTPwCost.params.trade_point_id = session.getTradePoint();  
        model.tradeItemsByTPwCost.requery();
        model.tradeItemsByTPwCost.forEach(function(cursor) {
            sessionItems[cursor.items_on_tp_id] = {};
            sessionItems[cursor.items_on_tp_id].itemID = cursor.item_id;
            sessionItems[cursor.items_on_tp_id].cost = model.tradeItemsByTPwCost.cursor.item_cost;
            sessionItems[cursor.items_on_tp_id].name = model.tradeItemsByTPwCost.cursor.item_name;
            sessionItems[cursor.items_on_tp_id].bonus_category = [];
            for (var i = 1; i<=3; i++){
                sessionItems[cursor.items_on_tp_id].bonus_category[i] = bonuses.getCountBonusesByItem(cursor.item_id, i);
            }
        });
        return sessionItems;
    }

    self.processOrder = function(anOrderDetails) {
        var session;
        if (!model.params.session_id && session.checkSession(anOrderDetails.session_id)) {
            //При внесении операции после окончания серверной сессии
            session = model.params.session_id = anOrderDetails.session_id;
            whSession.setCurrentSession(anOrderDetails.session_id);
        } else {
            session = getCurrentSession();
        };
        
        odp.processOrder(anOrderDetails, session, sessionItems);
    };
    
    getCurrentSession();
}
