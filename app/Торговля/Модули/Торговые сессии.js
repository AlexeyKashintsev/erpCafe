/**
 * 
 * @author Alexey
 * @module
 * @resident
 * @public
 */ 
function TradeSessions() {
    var self = this, model = this.model;
    
    self.initializeSession = function(aSession, aStartBalance) {
        model.qTradeSessionBalance.push({
            session_id  :   aSession,
            start_value :   aStartBalance
        });
        model.params.session_id = aSession;
        model.save();
    };

    var userName = self.principal.name;
    
    function getSelfSession(){
        model.qOpenedSession.params.user_name = self.principal.name;
        model.qOpenedSession.execute();
        return model.qOpenedSession.org_session_id;
    }
    
    //задать торговую точку и имя пользователя
    
    
    //Запись прихода по кассе
    self.processOrder = function(anOrderDetails){
        if (!model.params.session_id){
            model.params.session_id = getSelfSession();
        }
        if (!model.params.session_id){
            alert("Сессия не открыта");
        } else {
            model.qTradeOperationBySession.push({
                operation_sum    : anOrderDetails.orderSum,
                operation_date   : new Date(),
                session_id       : model.params.session_id,
                operation_type   : null //TODO Поменять тип операции
            });
        }
        var TradeOperationId = model.qTradeOperationBySession.trade_cash_box_operation_id;
        model.save();
    };
     //Запись прихода по кассе
     
    
    //TODO записать в журнал торговых операций, записать приход по кассе, посчитать
    //расход по складу и записать
}
