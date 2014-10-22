/**
 * 
 * @author Alexey
 * @module
 * @public
 */ 
function testMain() {
    var self = this, model = this.model;
    var log = document.getElementById("log");
    //login('testbar','testbar');
    var testList = [{
            name: 'testFranchaziCreate'
        },
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
        loadModules : 'Загрузка модулей',
        ok          : 'ok',
        error       : 'ошибка',
        fault       : 'Крах теста',
        loadReady   : 'Готов. Всего тестов',
        test        : 'Тест'
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
        $.ajax({
            url: "/erpCafe/j_security_check",
            data: { j_username: aUserName, j_password: aPassword },
            type: "POST",
            async: false,
            success: function() {
                console.log("Log In! ");
            },
            error: function(e) {
                console.log("Login Failed..");
            }
        });
    }
    
    function createRequireList(){
        var testListReq = [];
        for (var j in testList) {
            testListReq[j] = testList[j].name;
        }
        return testListReq;
    }
    
    function doTests() {
        message(messages.loadModules, '');
        var ok = 0;
        var bad = 0;
        require(createRequireList(), function() {
            self.success('Ok');
            for (var j in testList) {
                message(messages.test + " " + j + " " + testList[j].name, '');
                try {
                    if (testList[j].login && testList[j].pass)
                        login(testList[j].login, testList[j].pass);
                    var test = new Module(testList[j].name);
                    test.init(self);
                    if (test.doTest())
                        ok++;
                    else
                        bad++;
                } catch (e) {
                    self.error(messages.fault + " " + testList[j] + ". " + messages.error +": " + e);
                    bad++;
                }
            }
        });
    }
    
    function initialize() {
        document.getElementById('startTest').onclick = doTests;
        message(messages.loadReady + " " + testList.length, 'sysInfo');
    }
    
    initialize();
}
