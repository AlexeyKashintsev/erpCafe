/**
 * Модуль для работы со складскими сессиями.
 * Сессия - промежуток времени в котором происходят операции со складом, такие как
 * добавление товаров, удаление товаров, списание товаров.
 * По одной торговой точке может быть открыта только одна сессия
 * @author mike, ak
 * @module
 * @public
 */
function WhSessionModule() {
    Session.set('WhSessionModule', this);
    var self = this, model = this.model;
    var ep = new EventProcessor();
    var session = Session.get("UserSession");

    self.WH_ADD_ITEMS = 1;
    self.WH_REMOVE_ITEMS = 2;
    self.WH_PRODUCE_ITEMS = 3;

    self.ERRORS = {
        1: "",
        2: ""
    };
    
    self.getSelfPropertyValue = function(aPropertyName) {
        return self[aPropertyName];
    };
    
    function setParams(aTradePointId, aSessionID) {
        try {
            if (!aTradePointId && !aSessionID) {
                aTradePointId = session.getTradePoint();
                aSessionID = session.getActiveTPSession();
            }
            model.params.session_id = aSessionID;
            model.params.trade_point_id = aTradePointId;
        } catch(e) {
            Logger.warning(e);//TODO Добавить запись в лог
        }
    }

    self.setTradePoint = function(aTradePointId) {
        setParams(aTradePointId, null);
        self.getCurrentSession();
        return model.params.session_id;
    };

    self.setCurrentSession = function(aSessionID) {
        setParams(null, aSessionID);
        self.getCurrentSession();
        return model.params.trade_point_id;
    };

    /*
     * Возвращает Id сесси если она уже сущесвует и не закрыта.
     * Иначе false 
     */
    self.getCurrentSession = function() {
        if (!model.params.session_id && !model.params.trade_point_id)
            setParams();
            
        model.qOpenedSession.execute();
        if (!model.qOpenedSession.empty) {
            model.params.trade_point_id = model.qOpenedSession.cursor.trade_point;
            model.params.session_id = model.qOpenedSession.cursor.org_session_id;
            ep.addEvent('openSession', {
                session: model.qOpenedSession.org_session_id,
                module: 'whSessions'
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
    function initializeSessionBalance(aStartValues) {
        if (!aStartValues && aStartValues !== {}) { // подставляем остатки от предыдущей сессии
            model.qLastClosedSessionOnTradePoint.requery();
            if (!model.qLastClosedSessionOnTradePoint.empty) {
                var lastSession = model.qLastClosedSessionOnTradePoint.cursor.org_session_id;
                aStartValues = getValuesBySession(lastSession, true);
            }
        }
        
        if (!!aStartValues && aStartValues !== {}) {
            model.itemsByTP.beforeFirst();
            while (model.itemsByTP.next()) {
                model.querySessionBalance.insert(
                        model.querySessionBalance.schema.session_id, model.params.session_id,
                        model.querySessionBalance.schema.item_id, model.itemsByTP.cursor.item_id
                    );
                model.querySessionBalance.cursor.start_value = aStartValues[model.querySessionBalance.cursor.item_id];
            }
            return true;
        } else
            return false;
    }

    /*
     * Создает сессию с указанным идентификатором, или, если он не указан
     * возвращает Id новой сессии
     */
    self.createSession = function(aSessionId, aRevision, aStartValues) {
        if (self.getCurrentSession()) {
            return aSessionId ? model.params.session_id : false;//Код ошибки
        } else {
            model.qOpenedSession.push({
                    trade_point :   model.params.trade_point_id,
                    start_date  :   new Date(),
                    user_name   :   session.getUserName(),
                    revision    :   aRevision
                });
            if (aSessionId)
                model.qOpenedSession.cursor.org_session_id = aSessionId;
            model.params.session_id = model.qOpenedSession.cursor.org_session_id;
            
            if (initializeSessionBalance(aStartValues)) {
                ep.addEvent('newSession', {
                    session: model.params.session_id,
                    module: 'whSessions'
                });
                model.save();
                return model.params.session_id;
            } else {
                model.revert();
                return false; //TODO Возвращать код ошибки, записывать в события
            }
        }
    };
    
    /*
     * Закрытие сессии
     */
    self.closeSession = function(aEndValues) {
        if (self.getCurrentSession()) {
            ep.addEvent('closeSession', {
                session: model.params.session_id,
                module: 'whSessions'
            });
            model.qOpenedSession.cursor.end_date = new Date();
                        
            if (model.qOpenedSession.cursor.revision && aEndValues) {
                model.querySessionBalance.params.session_id = model.params.session_id;
                model.querySessionBalance.requery();
                model.querySessionBalance.beforeFirst();
                while (model.querySessionBalance.next()) {
                    model.querySessionBalance.cursor.end_value = aEndValues[model.querySessionBalance.cursor.item_id];
                }
                model.save();
            } else {
                model.save();
                model.updateItems.params.session_id = model.params.session_id;
                model.updateItems.executeUpdate();
            }
            
            model.params.session_id = null;
            return true;
        } else
            return false;
    };

    /*
     * Отмена ревизии (удаление)
     * @param {type} aSessionId
     * @returns {undefined}
     * @rolesAllowed admin franchazi
     */
    self.cancelRevision = function(aSessionId){
        model.qDeleteRevision.params.session_id = aSessionId;
        model.qDeleteRevision.executeUpdate();
        model.save();
        
        model.params.session_id = null;
    };

    /*
     * Получение стартовых значений текущей Баланса Сессии по каждому товару торговой
     * точки
     */
    self.getCurrentStartValues = function() {
        if (self.getCurrentSession()) {
            return getValuesBySession(model.params.session_id);
        }
        else
            return false;
    };

    /*
     * Возвращает начальные или конечные значения баланса Item в сессии
     * @param {type} aSession
     * @param {type} aEndValue - если true, то возвращает конечные значения
     * @returns {Array}
     */
    function getValuesBySession(aSession, aEndValue) {
        var values = {};
        model.querySessionBalance.params.session_id = aSession;
        model.querySessionBalance.requery();
        model.querySessionBalance.beforeFirst();
        while (model.querySessionBalance.next()) {
            values[model.querySessionBalance.cursor.item_id] = aEndValue ?
                    model.querySessionBalance.cursor.end_value
                    : model.querySessionBalance.cursor.start_value;
        }
        return values;
    }

    /*
     * Добавление товаров на склад
     */
    self.whMovement = function(anItems, aMovementType, aSession) {
        if (aSession)
            setParams(null, aSession);
        
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
