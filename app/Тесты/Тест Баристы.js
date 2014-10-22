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
    var Session = new ServerModule("UserSession");
    var TM = new ServerModule("ServerModuleForTests");
    var TS = new ServerModule("TradeSessions");
    var BM = new ServerModule("BillModule");
    var CM = new ServerModule("ClientServerModule");
    var WH = new ServerModule("WhSessionModule");
        
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
    
    //Функции для теста
    var session;
    /*
    * Простая покупка
    * @type type
    */
    var buyDefault = {
        name : "buyDefault",
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
    /*
    * Покупка за деньги с начислением бонусов
    */
    var buyWithMoney = {
        name : "buyWithMoney",
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
        orderSum: 700,
        clientData: CM.getClientDataByPhone("71234567890")
    };

    /*
     * Покупка за бонусы
     */

    var buyWithBonus = {
        name : "buyWithBonus",
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
        orderSum: 700,
        clientData : CM.getClientDataByPhone("71234567890")
    };

    function checkState(aTypeOperation, orderDetails){
        info("Проверяем значения отслеживаемых параметров....");
        var output = {};
        if (aTypeOperation !== "buyDefault"){
            output.BonusCount = BM.getSumFromAccountId(orderDetails.clientData.bonusBill);
            info("Текущее значение бонусов у клиента " + output.BonusCount);
        }
        output.cash = TM.checkOperationsSum(session);
        return output;
    }
    
    function checkResult(before, after, aTypeOperation){
//        var ChangeInCashBoxBalance = false;
//        try {
//            ChangeInCashBoxBalance = TM.changeInCashBoxBalance(session);
//        } catch (e){
//            error("Не удалось получить изменения в кассе. Возможно проблемы с сессией.");
//            info(e);
//        }
//        try {
//            ChangeInWareHouse = TM.changeInCashBoxBalance(session);
//        } catch (e){
//            error("Не удалось получить изменения в кассе. Возможно проблемы с сессией.");
//            info(e);
//        }
        
        
        switch (aTypeOperation){
            case "buyDefault":
                if (after.cash && before.cash){
                    success("Количество денег в кассе изенилось на " + (after.cash - before.cash));
                } else {
                    ok = false;
                    error("в кассе нет изменений");
                }
                break;
            case "buyWithMoney":
                if (after.cash && before.cash){
                    success("Количество денег в кассе изенилось на " + (after.cash - before.cash));
                } else {
                    ok = false;
                    error("в кассе нет изменений");
                }
                if (before.BonusCount){
                    if (Number(before.BonusCount) < Number(after.BonusCount)){
                        success("Бонусы начислены в размере " + (after.BonusCount - before.BonusCount));
                    } else {
                        error ("Бонусы не начислены!");
                        ok = false;
                    }
                }
                break;
            case "buyWithBonus":
                if (after.cash && before.cash){
                    if ((after.cash - before.cash) == 0){
                        success("В кассе изменений не произошло");
                    } else {
                        ok = false;
                        error("Количество денег в кассе изенилось на " + (after.cash - before.cash));
                    }
                }
                if (before.BonusCount){
                    if (Number(before.BonusCount) > Number(after.BonusCount)){
                        success("Бонусы списаны в размере " + (before.BonusCount - after.BonusCount));
                    } else {
                        error ("Бонусы не списаны!");
                        ok = false;
                    }
                }
                break;
        }
    }
    
    
    function openSession(){
        try {
            WH.createSession();
            session = WH.getCurrentSession();
            TS.initializeSession(session, 0);
            if (session){
                info("Открыли сессию... " + session);
            } else {
                info("Сессия не открыта!");
                revision();
                WH.createSession();
                session = WH.getCurrentSession();
                TS.initializeSession(session, 0);
                if (session) {
                    info("Открыли сессию... " + session);
                } else {
                    error("Сессия не открывается");
                    ok = false;
                    return 0;
                }
            }
        } catch (e) {
            info("Не удалось открыть сессию");
            error(e);
        }
        
    }
    
    function closeSession(){
        try{
            TS.calculateFinalValues(session ? session : WH.getCurrentSession());
            WH.closeSession();
        } catch(e){
            error("ошибка при закрытии сессии");
            info(e);
        }
        
    }
    
    function revision(){
        info("Проводим ревизию");
        try {
            WH.createSession(null, true, TM.getItemsFromTradePoint(6));
            WH.closeSession(TM.getItemsFromTradePoint(6));
            info("Ревизия проведена");
        } catch(e) {
            error("Ошибка при проведении ревизии " + e);
        }
        
    }
    
    function processOrderUnderShell(orderDetails){
        var after, before = {};
        info("Начинаем операцию " + orderDetails.name);
        before = checkState(orderDetails.name, orderDetails);
        try {
            if (TS.processOrder(orderDetails) === 0){
                success("Товар проведен клиенту " + orderDetails.clientData.phone + " за " + orderDetails.methodOfPayment);
            } else {
                error("Товар не проведен");
            }
        } catch(e) {
            error("Ошибка в processOrder");
            info(e);
        }
        
        after = checkState(orderDetails.name, orderDetails);
        
        try {
            checkResult(before, after, orderDetails.name);
        } catch(e){
            error("ошибка при проверке результатов выполнения теста");
            info(e);
        }
    }
    
    function doTest() {
        info("Начало теста");
        Session.login();
        WH.setTradePoint(6);
        openSession();
        
        processOrderUnderShell(buyDefault);
        processOrderUnderShell(buyWithMoney);
        processOrderUnderShell(buyWithBonus);
        
        closeSession();
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
        WH.closeSession();
       // console.log('Logged out...');
    };
}
