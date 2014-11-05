/**
 * 
 * @author StipJey
 * @module
 */ 
function testFrame() {
    var self = this, model = this.model;
    self.parent = null;
    self.name = 'Тест окна';
    self.roles = ['admin'];
    self.testsCount = 1;
    var ServerTestModule = new ServerModule("ServerModuleForTests");
    var WH = new ServerModule("WhSessionModule");
    var TS = new ServerModule("TradeSessions");
    var BM = new ServerModule("BillModule");
    var CM = new ServerModule("ClientServerModule");
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
    
    function doTest() {
        info("Начало теста");
        var win = window.open("/erpCafe/application-start.html","test");
        

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
