/**
 * 
 * @author Alexey
 * @module
 */ 
function AdminStartForm() {
var self = this, model = this.model, form = this;
    try {
        self.session = session;
    } catch(e) {
        self.session = new ServerModule('UserSession');
    }
    self.actionListDisplay = null;

    self.session.getFranchazi(function(anFranchaziId){
        self.setFranchazi(anFranchaziId);
    });
    
    self.setFranchazi = function(aFaranchazi) {
        if (!aFaranchazi) Logout();
        model.params.franchaziId = aFaranchazi;
    };
    
    self.getFranchazi = function() {
        return model.params.franchaziId;
    };

    self.actionList = {
        common          :   {
            display     :   "Дашборд",
            dispForm    :   "TradePointsDashboard",
            selfGeneration  :   true,
            defEnabled  :   true
        },
        /*buyItems        :   {
            display     :   "Заказ товаров",
            dispForm    :   "BuyItemsForm"
        },
        historyOrders        :   {
            display     :   "История заказов",
            dispForm    :   "HistoryOrders"
        },*/
        tradePositions  :   {
            display     :   "Номенклатура товаров",
            dispForm    :   "ItemsForTrade"
        },
        tradeModifiers  :   {
            display     :   "Дополнительные справочники",
            dispForm    :   "TradeItemsModifiersValues"
        },
        suppliers       :   {
            display     :   "Поставщики",
            dispForm    :   "SuppliersForm"
        },
        users           :   {
            display     :   "Пользователи",
            dispForm    :   "FranchaziUsers"
        },
        billAndServices :   {
            display     :   "Счета и услуги",
            dispForm    :   "BillsFranchazi"
        }
    };
    
    self.actionListDisplay = new wf.ActionList(self.actionList, document.getElementById("actionPanel"));
    cmn.addTopRightControl("Выход", "log-out", Logout);
}
