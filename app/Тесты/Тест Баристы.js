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
        var output = {};
        if (aTypeOperation !== "buyDefault"){
            output.BonusCount = BM.getSumFromAccountId(orderDetails.clientData.bonusBill);
            info("Текущее значение бонусов у клиента " + output.BonusCount);
        }
        //TODO Добавить снятие информации о наличке в кассе
        return output;
    }
    
    function checkResult(before, after, aTypeOperation){
        switch (aTypeOperation){
            case "buyDefault":
                //TODO проверка начисления налички в кассу
                break;
            case "buyWithMoney":
                //TODO проверка начисления налички в кассу
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
                //TODO проверка начисления налички в кассу
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
    
    function processOrderUnderShell(orderDetails){
        var after, before = {};
        info("Начинаем операцию " + orderDetails.name);
        info("Проверяем значения отслеживаемых параметров....");
        before = checkState(orderDetails.name, orderDetails);
        TS.processOrder(orderDetails);
        success("Товар проведен клиенту " + orderDetails.clientData.phone + " за " + orderDetails.methodOfPayment);
        info("Проверяем значения отслеживаемых параметров....");
        after = checkState(orderDetails.name, orderDetails);      
        checkResult(before, after, orderDetails.name);
    }
    
    function doTest() {
        info("Начало теста");
        WH.setTradePoint(6);
        WH.createSession();
        TS.initializeSession(WH.getCurrentSession(), 0);
        
        processOrderUnderShell(buyDefault);
        processOrderUnderShell(buyWithMoney);
        processOrderUnderShell(buyWithBonus);

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
