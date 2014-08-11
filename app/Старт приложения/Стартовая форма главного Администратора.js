/**
 * 
 * @author mike
 * @rolesAllowed admin
 */
function StartMasterAdminForm() {
    var self = this, model = this.model, form = this;
    
    self.actionList = {
        franchazi   :   {
            display     :   "Франчази и торговые точки",
            dispForm    :   "SelectFranchaziAdminForm"
        },
        users   :   {
            display     :   "Пользователи",
            dispForm    :   "FranchaziUsers"
        },
        warehouse   :   {
            display     :   "Склад",
            dispForm    :   "SelectItemsInWH",
            inner   :   {
                display     :   "Типы товаров",
                dispForm    :   "ItemTypesForm"
            }
        },
        tradePositions  :   {
            display     :   "Торговые позиции",
            dispForm    :   "ItemsForTrade"
        }
    };
    
    
    self.actionListDisplay = new cmn.ActionList(self.actionList, document.getElementById("actionPanel"));
    cmn.addTopRightControl("Выход", "log-out", logout);
}
