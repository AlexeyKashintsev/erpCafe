/**
 * 
 * @author mike
 * @rolesAllowed franchazi
 */
function AdminStartForm() {
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
    
    //Определяем как запущена программа
    self.browser = null;
    try {
        (function(){
            self.browser = false;
            self.session.login();
            self.setFranchazi(self.session.getFranchazi());
        }).invokeBackground();
    } catch (e) {
        Logger.info('browser');
        self.browser = true;
        self.session.getFranchazi(function(anFranchaziId){
            self.setFranchazi(anFranchaziId);
        });
    }
    
    self.setFranchazi = function(aFaranchazi) {
        if (!aFaranchazi) Logout();
        model.params.franchaziId = aFaranchazi;
        
        if (!self.browser) {
            workShop = new FranchaziWorkShop();
            workShop.setFranchazi(aFaranchazi);

            usersView = new FranchaziUsers();
            usersView.setFranchazi(aFaranchazi)
        }
     /*   ;*/
    };
    
    self.getFranchazi = function() {
        return model.params.franchaziId;
    };
    
self.showFormAsInternal = function(aForm) {
    if(!guiUtils.showOpenedForm(aForm, form.desktop)){
        var frameRunner = aForm;
        try{
            frameRunner.desktop = form.desktop;
            frameRunner.showInternalFrame(form.desktop);
        }finally{

        }
        frameRunner.toFront();
    }
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
            selfGeneration  :   true
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
     /*   warehouse       :   {
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
        },*/
        tradePoints :   {
            display     :   "Торговые точки",
          //  glyph       :   "glyphicon glyphicon-cog",
            dispForm    :   "FranchaziWorkShop"
        },
        billAndServices :   {
            display     :   "Счета и услуги",
            dispForm    :   "BillsFranchazi"
        }
    };
    
    if (self.browser) {
        self.actionListDisplay = new cmn.ActionList(self.actionList, document.getElementById("actionPanel"));
        cmn.addTopRightControl("Выход", "log-out", Logout);
    }
}
