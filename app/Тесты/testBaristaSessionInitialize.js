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
    
    function login(aUserName, aPassword) {
        $.post("/erpCafe/j_security_check", { j_username: aUserName, j_password: aPassword }, function(){ 
            success('Logged in...');
        })
        .fail(function() {
            alert("error");
        });
    }
    
    function doTest() {
        info("Начало теста");
        var TS = new ServerModule("TradeSessions");
        var Session = new ServerModule("UserSession");
        if (!Session.getUserName()){
            login("barista", "barista");
        }
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
        
        orderDetails = {
            clientData: {
                birthday: "2014-09-23T20:00:00.000Z",
                bonusBill: 141086646910207,
                bonusCategory: 1,
                bonusCount: 20,
                email: "asd@asd.ru",
                firstName: "Вася",
                lastName: "Иванов",
                middleName: "Петрович",
                phone: "71234567890",
                registrationDate: "2014-09-16T11:21:00.000Z"
            },
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
            success("Товар проведен клиенту " + orderDetails.clientData.phone + " за деньги");
        });
        
        orderDetails = {
            clientData: {
                birthday: "2014-09-23T20:00:00.000Z",
                bonusBill: 141086646910207,
                bonusCategory: 1,
                bonusCount: 2000,
                email: "asd@asd.ru",
                firstName: "Вася",
                lastName: "Иванов",
                middleName: "Петрович",
                phone: "71234567890",
                registrationDate: "2014-09-16T11:21:00.000Z"
            },
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
            orderSum: 700
        };
        TS.processOrder(orderDetails, function(){
            success("Товар проведен клиенту " + orderDetails.clientData.phone + " за бонусы");
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
