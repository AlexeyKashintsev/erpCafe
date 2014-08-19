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
            dispForm    :   "FranchaziAndTradePoints"
        },
        users   :   {
            display     :   "Пользователи",
            dispForm    :   "FranchaziAndUsers"
        },
        warehouse   :   {
            display     :   "Склад",
            dispForm    :   "WarehouseItemList"
        },
        warehouseTypes  :   {
            display     :   "Типы продуктов",
            dispForm    :   "ItemTypesForm"
        },
        tradePositions  :   {
            display     :   "Торговые позиции",
            dispForm    :   "ItemsForTrade"
        }
    };
    
    
    self.actionListDisplay = new cmn.ActionList(self.actionList, document.getElementById("actionPanel"));
    cmn.addTopRightControl("Выход", "log-out", logout);
}
