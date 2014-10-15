/**
 * 
 * @author StipJey
 * @module
 */ 
function testAddTradeItemsOnTradePoint() {
    var self = this, model = this.model;
    self.parent = null;
    self.name = 'Добавление Торговой позиции на Торговую Точку';
    self.roles = ['admin'];
    self.testsCount = 1;
    var TS = new ServerModule("TradeSessions");
    var BM = new ServerModule("BillModule");
    var CM = new ServerModule("ClientServerModule");
    var WH = new ServerModule("WhSessionModule");
    var TAM = new ServerModule("TradeAdminModule");
        
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
    
    function delItem(data){
        model.tradeItemsByTP.params.actual_date = new Date();
        model.tradeItemsByTP.params.franchazi_id = 1;
        model.tradeItemsByTP.params.item_id = data.id;
        model.tradeItemsByTP.params.trade_point_id = data.tp;
        model.tradeItemsByTP.requery();
        if (model.tradeItemsByTP.length > 0){
            info("На точке уже есть такой товар. Удаляем...");
            model.tradeItemsByTP.deleteRow();
        }
        model.save();
    }
    
    function checkItem(data){
        model.tradeItemsByTP.params.actual_date = new Date();
        model.tradeItemsByTP.params.franchazi_id = 1;
        model.tradeItemsByTP.params.item_id = data.id;
        model.tradeItemsByTP.params.trade_point_id = data.tp;
        model.tradeItemsByTP.requery();
        if (model.tradeItemsByTP.length > 0){
            info("Товар есть на точке");
            return true;
        } else {
            info("Товара нет на точке");
            return false;
        }
    }
    
    function doTest() {
        var testData = {
            id:1,
            tp:6,
            cost:155
        };
        info("Начало теста");
        //WH.setTradePoint(6);
        //WH.createSession();
        delItem(testData);
        if (!checkItem(testData)){
            info("Добавляем товар на ТТ...");
            TAM.setCost4TradeItemOnTradePointOrFranchzi(testData.id, testData.tp, 1, testData.cost);
        } else {
            ok = false; return ok;
        }
        if (checkItem(testData)) {
            ok = true;
            return ok;
        } else {
            ok = false;
            return ok;
        }
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
