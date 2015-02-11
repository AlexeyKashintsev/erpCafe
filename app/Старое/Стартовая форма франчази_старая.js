/**
 * 
 * @author mike
 * @rolesAllowed franchazi
 */
function AdminStartForm_old() {
    var self = this, model = this.model, form = this;
    try {
        self.session = session;
    } catch(e) {
        self.session = new ServerModule('UserSession');
    }
    var guiUtils = new guiModule();
    self.actionListDisplay = null;
    var usersView = null;
    var workShop = null;

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

    function btnUsersViewActionPerformed(evt) {//GEN-FIRST:event_btnUsersViewActionPerformed
        self.showFormAsInternal(usersView);
    }//GEN-LAST:event_btnUsersViewActionPerformed

    function button2ActionPerformed(evt) {//GEN-FIRST:event_button2ActionPerformed
        self.showFormAsInternal(workShop);
    }//GEN-LAST:event_button2ActionPerformed
    
    self.actionList = {
        common          :   {
            display     :   "Дашборд",
            dispForm    :   "TradePointsDashboard",
            selfGeneration  :   true,
            defEnabled  :   true
        },
        users           :   {
            display     :   "Пользователи",
            dispForm    :   "FranchaziUsers"
        },
        buyItems        :   {
            display     :   "Заказ товаров",
            dispForm    :   "BuyItemsForm"
        },
        historyOrders        :   {
            display     :   "История заказов",
            dispForm    :   "HistoryOrders"
        },
        tradePositions  :   {
            display     :   "Номенклатура товаров",
            dispForm    :   "ItemsForTrade"
        },
        billAndServices :   {
            display     :   "Счета и услуги",
            dispForm    :   "BillsFranchazi"
        }
    };
    
    self.actionListDisplay = new wf.ActionList(self.actionList, document.getElementById("actionPanel"));
    cmn.addTopRightControl("Выход", "log-out", Logout);
}
