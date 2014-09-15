/**
 * 
 * @author mike
 * @rolesAllowed franchazi
 */
function AdminStartForm() {
    var self = this, model = P.loadModel(this.constructor.name);//, form = P.loadForm(this.constructor.name, model);
    /*try {
        self.session = units.userSession;
    } catch(e) {
        self.session = new P.ServerModule('UserSession');
    }*/
    self.actionListDisplay = null;
    var usersView = null;
    var workShop = null;
    
    session.getFranchazi(function(anFranchaziId){
        self.setFranchazi(anFranchaziId);
    });
    
    self.setFranchazi = function(aFaranchazi) {
        if (!aFaranchazi)
            P.logout();
        model.params.franchaziId = aFaranchazi;
    };
    
    self.getFranchazi = function() {
        return model.params.franchaziId;
    };
    
    self.actionList = {
        common   :   {
            display     :   "Общая информация",
            dispForm    :   "TradePointsDashboard",
            selfGeneration  :   true
        },
        users   :   {
            display     :   "Пользователи",
            dispForm    :   "FranchaziUsers"
        },
        warehouse   :   {
            display     :   "Склад",
            dispForm    :   "WarehouseItemList",
            inner   :   {
                display     :   "Типы товаров",
                dispForm    :   "ItemTypesForm"
            }
        },
        tradePositions  :   {
            display     :   "Торговые позиции",
            dispForm    :   "ItemsForTrade"
        },
        tradePoints :   {
            display     :   "Торговые точки",
            dispForm    :   "FranchaziWorkShop"
        },
        test    :   {
            display     :   "Test",
            dispForm    :   "tstFrom"
        }
    };

    self.actionListDisplay = new cmn.ActionList(self.actionList, document.getElementById("actionPanel"));
    cmn.addTopRightControl("Выход", "log-out", P.logout);
}
