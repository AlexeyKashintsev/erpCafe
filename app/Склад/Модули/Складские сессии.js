/**
 * 
 * @author mike
 * @module
 */ 
function WhRevisionByBaristaModule() {
    var self = this, model = this.model;
    
    /*
     * Возвращает Id сесси если она уже сущесвует и не закрыта.
     * Иначе false 
     */
    self.getSessionState = function (anTradePointId) {
        model.params.trade_point_id = anTradePointId;
        model.getSessions.beforeFirst();
        while(model.getSessions.next()){
            if(!model.getSessions.cursor.end_date){
                return model.getSessions.cursor.wh_session_id;
            }
        }
        return false;
    };
    
    function initSession(aSessionId){
        model.itemsByTP.beforeFirst();
        while(model.itemsByTP.next()){
            model.querySessionBalance.insert(
                model.querySessionBalance.schema.session_id, aSessionId,
                model.querySessionBalance.schema.item_id, model.itemsByTP.cursor.item_id,
                model.querySessionBalance.schema.start_value, 0
            );
        }
    }
    
    /*
     * Возвращает Id новой сессии
     */
    self.createSession = function (anTradePointId){
        if(self.getSessionState(anTradePointId)){
            return self.getSessionState(anTradePointId);
        } else {
            model.getSessions.insert();
            model.getSessions.cursor.warehouse = anTradePointId;
            model.getSessions.cursor.start_date = new Date();
            initSession(model.getSessions.cursor.wh_session_id);
            model.save();
            return model.getSessions.cursor.wh_session_id;
        }
    };
    /*
     * Закрытие сессии
     */
    self.closeSession = function (anTradePoint, aSessionId){
        model.params.session_id = aSessionId;
        model.params.trade_point_id = anTradePoint;  
        if(model.getSessions.cursor.end_date){
            return false;
        } else {
            model.getSessions.cursor.end_date = new Date();
            model.save();
            return true;
        }
    };
    /*
     * 
     */
    self.setStartValues = function (anTradePointId, anItems){
        model.params.trade_point_id = anTradePointId;  
        var session_id = self.getSessionState(anTradePointId);
        if(session_id){
            model.querySessionBalance.params.session_id = session_id;
            model.querySessionBalance.requery();
            model.querySessionBalance.beforeFirst();
            while(model.querySessionBalance.next()){
                 model.querySessionBalance.cursor.start_value = anItems[model.querySessionBalance.cursor.item_id];
            }
            return true;
        } else {
            return false;
        }
    };
    
    self.getStartValues = function (anTradePointId) {
        model.params.trade_point_id = anTradePointId;  
        var session_id = self.getSessionState(anTradePointId);
        if(session_id){
            var items = [];
            model.querySessionBalance.params.session_id = session_id;
            model.querySessionBalance.requery();
            model.querySessionBalance.beforeFirst();
            while(model.querySessionBalance.next()){
                items[model.querySessionBalance.cursor.item_id] = model.querySessionBalance.cursor.start_value;
            }
            return items;
        }
        else return false;
    };
    
}
