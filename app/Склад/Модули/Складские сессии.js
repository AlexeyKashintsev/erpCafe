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
            
            var initSessionResult = initializeSessionBalance(aStartValues);
            
            if (initSessionResult) {
                ep.addEvent('newSession', {
                    session: model.params.session_id,
                    module: 'whSessions'
                });
                model.save();
                return model.params.session_id;
            } else {
                model.revert();
                return false; 
                Logger.warning("Сессия не инициализирована. " + aSessionId);
                ep.addEvent('initSessionError', {
                    session: model.params.session_id,
                    trade_point: model.params.trade_point_id
                });
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
    
    self.getItemsLimit = function(anItems) {
        model.qWHSessionBalance.params.session_id = self.getCurrentSession();
        model.qWHSessionBalance.requery();
        
        var res = [];
        for (var j in anItems)
            res.push({itemID : anItems[j], limit : self.getItemLimit(anItems[j])});
        return res;
    };
    
    self.getItemLimit = function(anItem) {
        var item = {};
        item[anItem] = 1;
        var items4Use = calculateConsumption(item);
        var minimum = null;
        
        for (var id in items4Use) {
            try {
                var whBalance = model.qWHSessionBalance.find(model.qWHSessionBalance.schema.item_id, id);
                var cons = whBalance !== [] ? Math.floor(whBalance[0].final_value / items4Use[id]) : null;
                if (minimum === null)
                    minimum = cons;
                if (minimum > cons)
                    minimum = cons;
            } catch(e) {
                
            }
        }
        return minimum;
    };
    
    self.processTradeItems = function(anItems) {
        var consumption = calculateConsumption(anItems);
        self.whMovement(consumption, self.WH_PRODUCE_ITEMS);
    };
    
    function getItemData(aTradeItemID) {
        //var itemData = model.qTradeItemsOnTP.find(model.qTradeItemsOnTP.schema.item_id, anItemID);
       // if (!itemData)
        var itemData = model.qTradeItemsOnTP.find(model.qTradeItemsOnTP.schema.trade_items_on_tp_id, aTradeItemID);
        return itemData ? itemData[0] : false;
    }
    
    function calculateConsumption(anItems) {
        var usedItems = {};
        for (var id in anItems) {
            var itemData = getItemData(id);
            if (itemData) {
                if (itemData.wh_item) {
                    if (usedItems[id])
                        usedItems[id] += anItems[id];
                    else
                        usedItems[id] = anItems[id];
                }
                if (itemData.wh_content) {
                    var contentsData = model.qContentsOnTp.find(model.qContentsOnTp.schema.item_on_tp_id, id);
                    var contents = {};
                    for (var j in contentsData)
                        contents[contentsData[j].content_item_id] = contentsData[j].usage_quantity * anItems[id];
                    contentsData = calculateConsumption(contents);
                    for (var j in contentsData) {
                        if (usedItems[j])
                            usedItems[j] += contentsData[j];
                        else
                            usedItems[j] = contentsData[j];
                    }
                }
            }
        }
        return usedItems;
    };
    
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
                    item_id: getItemData(id).item_id,
                    item_on_tp_id: id,
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
    
    function setParams(aTradePointId, aSessionID) {
        try {
            if (!aTradePointId && !aSessionID) {
                aTradePointId = session.getTradePoint();
                aSessionID = session.getActiveTPSession();
            }
            model.params.session_id = aSessionID;
            model.params.trade_point_id = aTradePointId;
        } catch(e) {
            Logger.warning(e);
        }
    }
    
    /*
     * Инициализация товаров по торговой точке
     * Если в прошлой сессии нет данных по товару, то устанавливается 0 
     * в качестве начального значения
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
        
        if (!aStartValues) 
            aStartValues = [];
        model.qWhItemsOnTP.beforeFirst();
        model.qWhItemsOnTP.forEach(function(cursor) {
            var startValue = aStartValues[cursor.item_id] ? aStartValues[cursor.item_id] : 0;
            model.querySessionBalance.push({
                    session_id: model.params.session_id,
                    item_id: cursor.item_id,
                    start_value: startValue
            });
        });
        return true;
//        } else
//            return false;
    }


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
        model.querySessionBalance.forEach(function(cursor) {
            values[cursor.item_id] = aEndValue ? cursor.end_value : cursor.start_value;
        });
        return values;
    }
}
