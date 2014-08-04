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
        model.save();
    };
    
    //задать торговую точку и имя пользователя
    //Пример заказа
        var orderDetails = {
        orderSum    :   null,
        orderItems  :   [
            {
                itemId      :   null,
                quantity    :   null
            },
            {
                itemId      :   null,
                quantity    :   null
            }
        ]
    };
    //TODO записать в журнал торговых операций, записать приход по кассе, посчитать
    //расход по складу и записать
}
