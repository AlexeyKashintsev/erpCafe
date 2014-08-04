var units = {};
var common = {};

common.showModal = function(aForm, aCallback) {
    aForm.showOnPanel('modalFormContent');
    aForm.onClose = aCallback;
    $('#modalForm').modal({});
}

if (!platypus) {
    var platypus = {};
}

platypus.ready = function() {
    require(['getUserSession'], function(){
            units.userSession = getUserSession();
            units.userSession.login(function(anUserRole){
                    switch (anUserRole) {
                        case 'admin':
                            break;
                        case 'franchazi':
                            break;
                        case 'barista':
                            require(['BaristaDesktop'], function(){
                                    units.bd = new BaristaDesktop();
                                });
                            break;
                    }
                });
            
        })
};