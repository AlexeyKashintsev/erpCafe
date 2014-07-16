/**
 * 
 * @author mike
 * @module
 */ 
function WarehouseFunctions() {
    var self = this, model = this.model;
    
    /*
     * Проверка существующих незакрытых сессий по торговой точке
     * aTradePointId - Идентификатор торговой точки
     * obj.msg - Информация о выполнении операции
     * obj.id - идентификатор созданой/существующей сесиии
     */    
    self.GetSession = function(aTradePointId){
        var obj = {}; 
        var items = [];
        model.params.trade_point_id = aTradePointId;
        model.getSessions.beforeFirst();
        while(model.getSessions.next()){
            if(!model.getSessions.cursor.end_date){
                obj.msg = "Уже существует незакрытая сессия";
                obj.id = model.getSessions.cursor.wh_session_id;
                
                model.querySessionBalance.params.session_id = model.getSessions.cursor.wh_session_id;
                model.querySessionBalance.requery();
                model.querySessionBalance.beforeFirst();
                while(model.querySessionBalance.next()){
                    items[model.querySessionBalance.cursor.item_id] = model.querySessionBalance.cursor.start_value;
                }
                obj.items = items;
                return obj;
            }
        }
        model.getSessions.insert();
        model.getSessions.cursor.warehouse = aTradePointId;
        model.getSessions.cursor.start_date = new Date();
        obj.msg = "Создана новая сессия";
        obj.id  = model.getSessions.cursor.wh_session_id;
        
        model.itemsByTP.beforeFirst();
        while(model.itemsByTP.next()){
            model.querySessionBalance.insert(
                    model.querySessionBalance.schema.session_id, model.getSessions.cursor.wh_session_id,
                    model.querySessionBalance.schema.item_id, model.itemsByTP.cursor.item_id,
                    model.querySessionBalance.schema.start_value, 0
                    );
            items[model.itemsByTP.cursor.item_id] = 0;
        }
        
        obj.items = items;
        model.save();
        return obj;
    };
    
    /*
     * Закрытие сессии
     */
    self.CloseSession = function (aTradePoint, aSessionId){
        //model.requery();
        model.params.session_id = aSessionId;
        model.params.trade_point_id = aTradePoint;  
        if(model.getSessions.cursor.end_date){
            return false;
        } else {
            model.getSessions.cursor.end_date = new Date();
            model.save();
            return true;
        }
    };
    
    self.AddItems = function(aSessionId, aItems){
        model.querySessionBalance.params.session_id = aSessionId;
        model.querySessionBalance.requery();
        model.querySessionBalance.beforeFirst();
        while(model.querySessionBalance.next()){
            model.querySessionBalance.cursor.start_value = aItems[model.querySessionBalance.cursor.item_id];
        }
        model.save();
        return aItems;
    };
}
