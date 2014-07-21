/**
 * Модуль для работы со складскими сессиями.
 * Сессия - промежуток времени в котором происходят операции со складом, такие как
 * добавление товаров, удаление товаров, списание товаров.
 * По одной торговой точке может быть открыта только одна сессия
 * @author mike
 * @module 
 */
function WhSessionModule() {
    var self = this, model = this.model;

    self.WH_ADD_ITEMS = 1;
    self.WH_DEL_ITMES = 2;
    self.WH_PRODUCE_ITEMS = 3;

    self.ERRORS = {
        1: "",
        2: ""
    };

    self.setTradePoint = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
        self.getCurrentSession();
        return model.params.session_id;
    };

    /*
     * Возвращает Id сесси если она уже сущесвует и не закрыта.
     * Иначе false 
     */
    self.getCurrentSession = function() {
        model.qOpenedSession.requery();
        if (model.qOpenedSession.length > 0) {
            model.params.session_id = model.qOpenedSession.cursor.wh_session_id;
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
            aSessionId ? model.qOpenedSession.insert(model.qOpenedSession.schema.wh_session_id, aSessionId) :
                    model.qOpenedSession.insert();
            model.params.session_id = model.qOpenedSession.cursor.wh_session_id;
            model.qOpenedSession.cursor.warehouse = model.params.trade_point_id;
            model.qOpenedSession.cursor.start_date = new Date();
            initSession();
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
            model.updateItems.executeUpdate();
            return true;
        } else
            return false;
    };
    /*
     * Изменение старотовых значений Баланса Сессии по каждому товару торговой
     * точки
     */
    self.setStartValues = function(anItems) {
        if (self.getCurrentSession()) {
            model.querySessionBalance.requery();
            model.querySessionBalance.beforeFirst();
            while (model.querySessionBalance.next()) {
                model.querySessionBalance.cursor.start_value = anItems[model.querySessionBalance.cursor.item_id];
            }
            model.save();
            return true;
        } else {
            return false;
        }
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
    self.addItems = function(anItems, aMovementType) {
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
