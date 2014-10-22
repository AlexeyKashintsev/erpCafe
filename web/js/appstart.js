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

platypus.ready = function() {
    require(['getUserSession'], function() {
        session = getUserSession();
        session.getUserRole(function(anUserRole){
                session.userRole = anUserRole;
                session.userName = session.getUserName();
                cmn.addHeaderLeft(session.userName, "user");
                session.sessionKeeper = setInterval(keepSession, sessionTimeout);
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
                lang: cmn.locale,
                global: {
                    useUTC: true
                }
        });
    };