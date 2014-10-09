/**
 * 
 * @author Alexey
 * @module
 */ 
function testBarista() {
    var self = this, model = this.model;
    self.parent = null;
    self.name = 'Создание франчази';
    self.roles = ['admin'];
    self.testsCount = 1;
    
    var messages = {
        successInit : 'Тест инициализирован',
        success     : 'Тест пройден',
        fail        : 'Тест провален',
        failure     : 'Тест провален (крах). Ошибка: '
    };
    var ok = true; //статус теста, false - если провален
    var error = null;
    var info = null;
    var success = null;
    
    self.init = function(aParent) {
        self.parent = aParent;
        error = aParent.error;
        info = aParent.info;
        success = aParent.success;
        info(self.name);
        success(messages.successInit);
    };
    
    
    
    function doTest() {
        info("Начало теста");
        var Session = new ServerModule("UserSession");
        var TS = new ServerModule("TradeSessions");
        var BM = new ServerModule("BillModule");
        var CM = new ServerModule("ClientServerModule");
        var WH = new ServerModule("WhSessionModule");
        WH.createSession();
        /*
         * Простая покупка
         * @type type
         */
        var orderDetails = {
            clientData: false,
            methodOfPayment: "money",
            orderItems: [
                {
                    itemId: 1,
                    quantity: 1
                },
                {
                    itemId: 33,
                    quantity: 1
                }],
            orderSum: 700
        };
        TS.processOrder(orderDetails, function(){
            success("Товар проведен");
        });
        
        /*
         * Покупка за деньги с начислением бонусов
         */
        
        orderDetails = {
            methodOfPayment: "money",
            orderItems: [
                {
                    itemId: 1,
                    quantity: 1
                },
                {
                    itemId: 33,
                    quantity: 1
                }],
            orderSum: 700
        };
        orderDetails.clientData = CM.getClientDataByPhone("71234567890");
        
        var startBonusCount = BM.getSumFromAccountId(orderDetails.clientData.bonusBill);
        info("Стартовое значение " + startBonusCount);
        TS.processOrder(orderDetails, function(){
            success("Товар проведен клиенту " + orderDetails.clientData.phone + " за деньги");
            var endBonusCount = BM.getSumFromAccountId(orderDetails.clientData.bonusBill);
            info("Конечное значение " + endBonusCount);
        });
        
        /*
         * Покупка за бонусы 
         */
        orderDetails = {
            methodOfPayment: "bonus",
            orderItems: [
                {
                    itemId: 1,
                    quantity: 1
                },
                {
                    itemId: 33,
                    quantity: 1
                }],
            orderSum: 7
        };
        orderDetails.clientData = CM.getClientDataByPhone("71234567890");

        var startBonusCount = BM.getSumFromAccountId(orderDetails.clientData.bonusBill);
        info("Стартовое значение " + startBonusCount);
        TS.processOrder(orderDetails, function(){
            success("Товар проведен клиенту " + orderDetails.clientData.phone + " за бонусы");
            var endBonusCount = BM.getSumFromAccountId(orderDetails.clientData.bonusBill);
            info("Конечное значение " + endBonusCount);
        });
    }
    
    self.doTest = function() {
        try {
            doTest();
            self.clear();
            if (ok) 
                success(messages.success);
            else
                error(messages.fail);
            return ok;
        } catch (e) {
            error(messages.failure + e);
        }
    };
    
    self.clear = function() {
      //logout();
       // console.log('Logged out...');
    };
}
