/**
 * Модуль для работы со складскими сессиями.
 * Сессия - промежуток времени в котором происходят операции со складом, такие как
 * добавление товаров, удаление товаров, списание товаров.
 * По одной торговой точке может быть открыта только одна сессия
 * @author mike 
 * @module
 * @public
 */
function WhSessionModule() {
    var self = this, model = this.model;
    var ep = new EventProcessor();

    self.WH_ADD_ITEMS = 1;
    self.WH_REMOVE_ITEMS = 2;
    self.WH_PRODUCE_ITEMS = 3;

    self.ERRORS = {
        1: "",
        2: ""
    };

    self.setTradePoint = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
        model.params.session_id = null;
        self.getCurrentSession();
        return model.params.session_id;
    };
    
    self.setCurrentSession = function(aSessionID) {
        model.params.session_id = aSessionID;
        model.params.trade_point_id = null;
        self.getCurrentSession();
        return model.params.trade_point_id;
    };

    /*
     * Возвращает Id сесси если она уже сущесвует и не закрыта.
     * Иначе false 
     */
    self.getCurrentSession = function() {
        model.qOpenedSession.requery();
        if (model.qOpenedSession.length > 0) {
            model.params.trade_point_id = model.qOpenedSession.cursor.trade_point;
            model.params.session_id = model.qOpenedSession.cursor.org_session_id;
            ep.addEvent('openSession', {
                session :   model.qOpenedSession.org_session_id,
                module  :   'whSessions'
            });
            return model.params.session_id;
        } else {
            model.params.session_id = null;
            return false;
        }
    };
    /*
     * Инициализация товаров по торговой точке
     * @param {type} aSessionId
     * @returns {undefined}
     */
    function initSession() {
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            model.querySessionBalance.insert(
                    model.querySessionBalance.schema.session_id, model.params.session_id,
                    model.querySessionBalance.schema.item_id, model.itemsByTP.cursor.item_id
                );
        }
    }

    /*
     * Создает сессию с указанным идентификатором, или, если он не указан
     * возвращает Id новой сессии
     */
    self.createSession = function(aSessionId) {
        if (self.getCurrentSession()) {
            return aSessionId ? model.params.session_id : false;//Код ошибки
        } else {
            aSessionId ? model.qOpenedSession.insert(model.qOpenedSession.schema.org_session_id, aSessionId) :
                    model.qOpenedSession.insert();
            model.params.session_id = model.qOpenedSession.cursor.org_session_id;
            model.qOpenedSession.cursor.trade_point = model.params.trade_point_id;
            model.qOpenedSession.cursor.start_date = new Date();
            model.qOpenedSession.cursor.user_name = self.principal.name;
            initSession();
            ep.addEvent('newSession', {
                session :   model.params.session_id,
                module  :   'whSessions'
            });
            model.save();
            return model.params.session_id;
        }
    };
    /*
     * Закрытие сессии
     */
    self.closeSession = function() {
        if (self.getCurrentSession()) {
            model.qOpenedSession.cursor.end_date = new Date();
            model.save();
            ep.addEvent('closeSession', {
                session :   model.params.session_id,
                module  :   'whSessions'
            });
            model.updateItems.executeUpdate();
            return true;
        } else
            return false;
    };
    /*
     * Изменение стартовых значений Баланса Сессии по каждому товару торговой
     * точки
     */
    self.setStartValues = function(anItems, aTradePoint) {
        self.setTradePoint(aTradePoint);
        
        if (!self.getCurrentSession()) {
            self.createSession();
        }

        model.querySessionBalance.requery();
        model.querySessionBalance.beforeFirst();
        while (model.querySessionBalance.next()) {
            model.querySessionBalance.cursor.start_value = anItems[model.querySessionBalance.cursor.item_id];
        }
        model.save();
        return true;
    };
    /*
     * Получение старотовых значений Баланса Сессии по каждому товару торговой
     * точки
     */
    self.getStartValues = function() {
        if (self.getCurrentSession()) {
            var items = [];
            model.querySessionBalance.params.session_id = model.params.session_id;
            model.querySessionBalance.requery();
            model.querySessionBalance.beforeFirst();
            while (model.querySessionBalance.next()) {
                items[model.querySessionBalance.cursor.item_id] = model.querySessionBalance.cursor.start_value;
            }
            return items;
        }
        else
            return false;
    };

    /*
     * Добавление товаров на склад
     */
    self.whMovement = function(anItems, aMovementType) {
        if (self.getCurrentSession()) {
            for (var id in anItems) {
                model.queryMovements.push({
                    session_id: model.params.session_id,
                    item_id: id,
                    movement_date: new Date(),
                    movement_type: aMovementType,
                    value: anItems[id]
                });
            }
            model.save();
            return true;
        } else {
            return false;
        }
    };
}
