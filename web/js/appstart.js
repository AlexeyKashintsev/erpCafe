if (!platypus) {
    var platypus = {};
}

/*session = {
    userRole
    userName
    activeSession
    tradePoint
    franchaziId
}*/
function SessionKeeper() {
    var tInd = this;
    var status = null;
    session.timeout = 15 * 60 * 1000;
    var showIndicator = false;
    var indicatorContainer = null;
    var ind = null;
    
    var statuses = ['Сессия активна', 'Сессия истекла', 'Нет связи с сервером'];
    var statCSS = ['active', 'ended', 'broken'];
    
    function indicator() {
        if (showIndicator) {
            if (!ind)
                ind = cmn.createElement('div', 'session_indicator',indicatorContainer);
            $(ind).removeClass('session_indicator_' + statCSS[0] + ' session_indicator_' + statCSS[1] + ' session_indicator_' + statCSS[3])
            $(ind).addClass('session_indicator_' + statCSS[status]);
        }
    }
    
    function checkSession(aCallBack) {
        Logger.info('Проверка сессии...');
        session.keepAlive(session.userName, function(aResult) {
            status = aResult ? 0 : 1;
            indicator();
            //alert([statuses[status]]);
            if (aCallBack) {
                aCallBack(status);
            }
        }, function() {
            status = 2;
            indicator();
            if (aCallBack)
                aCallBack(status);
        });
    };
    
    tInd.check = function(aCallBack) {
        status = checkSession(aCallBack);
    }
    
    this.showIndicator = function(aContainer) {
        tInd.check();
        showIndicator = true;
        indicatorContainer = aContainer;
        indicator();
    }
    
    this.hideIndicator = function() {
        showIndicator = false;
        $(ind).hide();
    }
    
    var keeper = setInterval(checkSession, session.timeout);
}

platypus.ready = function() {
    $('#modalForm').on('hidden.bs.modal', function (e) {
        document.getElementById('modal-body-window').innerHTML = '';
    })
    require(['getUserSession'], function() {
        session = getUserSession();
        session.getUserRole(function(anUserRole){
                session.userRole = anUserRole;
                session.userName = session.getUserName();
                cmn.addHeaderLeft(session.userName, "user");
                session.sessionKeeper = new SessionKeeper();
                switch (anUserRole) {
                    case 'admin':
                        require(['StartMasterAdminForm'], function() {
                            units.asf = new StartMasterAdminForm();
                        });
                        break;
                    case 'franchazi':
                        session.getFranchazi(
                            function(aFranchazi){
                                session.franchaziId = aFranchazi;
                                require(['AdminStartForm'], function() {
                                    units.asf = new AdminStartForm();
                                });
                            });
                        break;
                    case 'barista':
                        session.getFranchazi(
                            function(aFranchazi){
                                session.franchaziId = aFranchazi;
                                require(['BaristaDesktop'], function(){
                                    units.bd = new BaristaDesktop();
                                });
                            });
                        break;
                    case 'client':
                        require(['ClientStartForm'], function(){
                            units.csf = new ClientStartForm();
                        });
                        break;
                    
                }
            });
        });
    
        Highcharts.setOptions({
            lang    : cmn.locale,
            global  : {
                useUTC  : true
            }
        });
    };