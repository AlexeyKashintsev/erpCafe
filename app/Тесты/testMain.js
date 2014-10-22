/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function testMain() {
    var self = this, model = this.model;
    var log = document.getElementById("log");
    var testRun = false;
    var currentTest = 0;
    var testMaker = null;
    var testList = [/*{
            name: 'testFranchaziCreate'
        },*/
        {
            name: 'testBarista',
            login: 'testbar',
            pass: 'testbar'
        }
//        ,
//        {
//                name: 'testAddTradeItemsOnTradePoint',
//                login: 'fran',
//                pass: 'fran'
//        }
    ];
    var useHTMLLog = true;
    var messages = {
        loadModule  : 'Загрузка модуля',
        ok          : 'ok',
        error       : 'ошибка',
        fault       : 'Крах теста',
        loadReady   : 'Готов. Всего тестов',
        test        : 'Тест',
        login       : 'Вход в систему от имени пользователя ',
        loadOk      : 'Загрузка завершена. Инициализация',
        logOk       : 'Вход выполнен',
        logout      : 'Выход'
        
    };
    
    function message(aMsg, aClass) {
        if (useHTMLLog) {
            var msg = document.createElement("p");
            msg.setAttribute('class', aClass);
            msg.innerHTML = (new Date).toGMTString() + " " + aMsg;
            log.appendChild(msg);
        } else {
            switch (aClass) {
                case 'error': {
                        Logger.severe(aMsg);
                        break;
                }
                default : {
                        Logger.info(aMsg);
                }
            }
        }
    }
    
    self.error = function(aMsg) {
        message(aMsg, 'error');
    };
    self.info = function(aMsg) {
        message(aMsg, 'info');
    };
    self.success = function(aMsg) {
        message(aMsg, 'success');
    };
    
    function login(aUserName, aPassword) {
        message(messages.login + ' ' + aUserName);
        $.ajax({
            url: "/erpCafe/j_security_check",
            data: { j_username: aUserName, j_password: aPassword },
            type: "POST",
            async: false,
            success: function() {
                message(messages.logOk);
                test(currentTest);
            },
            error: function(e) {
                message(messages.error);
            }
        });
    }
    
    function logout() {
        //http://localhost:8080/erpCafe/application/api?__type=12
        message(messages.logout);
        var result = false;
        $.ajax({
            url: "/erpCafe/application/api?__type=18",
            type: "POST",
            async: false,
            success: function() {
                message(messages.ok);
                result = true;
            },
            error: function(e) {
                message(messages.error);
                result = false;
            }
        });
    }
    
    function test() {
        message(messages.loadModule + ' ' + (testList[currentTest].name ? testList[currentTest].name : '---'));
        require(testList[currentTest].name, function() {
            try {
                message(messages.loadOk);
//                if (testList[currentTest].login && testList[currentTest].password)
//                    login(testList[currentTest].login, testList[currentTest].password);
                var test = new Module(testList[currentTest].name);
                test.init(self);
                test.doTest();
                /*if (test.doTest())
                    ok++;
                else
                    bad++;*/
            } catch (e) {
                message(message.fault);
            }
            finally {
                logout();
                currentTest++;
                testRun = false;
            }
        });
    }
    
    function doTest() {
        message(messages.test + ' №' + currentTest + testList[currentTest].name);
        testRun = true;
        var ok = true;
        var doLogin = testList[currentTest].login && testList[currentTest].password;
        if (doLogin) {
            logout();
            ok = login(testList[currentTest].login, testList[currentTest].password);
        }
        if (ok) {
            test(currentTest);
        }
    }
    
    function doTests() {
        testMaker = setInterval(function() {
            if (!testRun) {
                if (currentTest < testList.length)
                    doTest();
                else
                    finish();
            }
        }, 500);
    }
    
    function initialize() {
        document.getElementById('startTest').onclick = doTests;
        message(messages.loadReady + " " + testList.length, 'sysInfo');
    }
    
    function finish() {
        clearInterval(testMaker);
    }
    
    initialize();
}
