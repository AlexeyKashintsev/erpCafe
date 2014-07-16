/**
 * 
 * @author mike
 * @module
 */ 
function GetItemsByBaristaModule() {
    var self = this, model = this.model;
    
    self.addMovements = function(aTradePointId, anItems){
        var session_id = 0, currentDate = new Date();
        model.params.trade_point_id = aTradePointId;
        model.getSessions.beforeFirst();
        while(model.getSessions.next()){
            if(!model.getSessions.cursor.end_date){
                //уже существует незакрытая сессия          
                session_id = model.getSessions.cursor.wh_session_id;           
            }
        }
        if(session_id == 0){
            model.getSessions.insert();
            model.getSessions.cursor.warehouse = aTradePointId;
            model.getSessions.cursor.start_date = new Date();
            session_id = model.getSessions.cursor.wh_session_id;
            
            //если создали новую сессию, заполнить ноликами товары на складе
            model.itemsByTP.beforeFirst();
            while(model.itemsByTP.next()){
                model.querySessionBalance.insert(
                    model.querySessionBalance.schema.session_id, session_id,
                    model.querySessionBalance.schema.item_id, model.itemsByTP.cursor.item_id,
                    model.querySessionBalance.schema.start_value, 0
                );
            }
            
            for(var item in anItems){
                model.queryMovements.insert(
                    model.queryMovements.schema.session_id, session_id,
                    model.queryMovements.schema.movement_date, currentDate,
                    model.queryMovements.schema.movement_type, 1,
                    model.queryMovements.schema.item_id, model.itemsByTP.cursor.item_id,
                    model.queryMovements.schema.value, anItems[item]
                );
            }
        } else {
            for(var item in anItems){
                model.queryMovements.insert(
                    model.queryMovements.schema.session_id, session_id,
                    model.queryMovements.schema.movement_date, currentDate,
                    model.queryMovements.schema.movement_type, 1,
                    model.queryMovements.schema.item_id, model.itemsByTP.cursor.item_id,
                    model.queryMovements.schema.value, anItems[item]  
                );
            }
        }   
        model.save();
    };
}
