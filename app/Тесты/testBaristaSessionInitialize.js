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
            console.log('Logged in...');
        })
        .fail(function() {
            alert( "error" );
        });
    }
    
    function doTest() {
        login("barista", "barista");
        
    }
    
    self.doTest = function() {
        try {
            login();
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
