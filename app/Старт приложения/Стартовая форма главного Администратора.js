/**
 * 
 * @author mike
 * @rolesAllowed admin
 */
function StartMasterAdminForm() {
    var self = this, model = this.model, form = this;
    
    self.actionList = {
        dashboard   :   {
            display     :   "Дашборд",
            dispForm    :   "AdminDashboard"
        },
        franchazi   :   {
            display     :   "Франчази и торговые точки",
            dispForm    :   "FranchaziAndTradePoints"
        },
        bills           :   {
            display     :   "Франчази и счета",
            dispForm    :   "FranchaziAndBills"
        },
        services        :   {
            display     :   "Управление услугами",
            dispForm    :   "ManageServices"
        },
        orderItems        :   {
            display     :   "Заказанные товары",
            dispForm    :   "OrederItems"
        },
        unpais        :   {
            display     :   "Неоплаченные счета",
            dispForm    :   "UnpaidBills"
        },
        items           :   {
            display     :   "Товары для продажи",
            dispForm    :   "BillItems"
        },
        users           :   {
            display     :   "Пользователи",
            dispForm    :   "FranchaziAndUsers"
        },
        warehouse       :   {
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
        },
        incomePlan      :   {
            display     :   "Настройка доходности",
            dispForm    :   "PlannedIncomeSettings"
        },
        messageEdit     :   {
            display     :   "Настройка сообщений",
            dispForm    :   "messengerSettings"
        },
        cheklist     :   {
            display     :   "Чеклисты",
            dispForm    :   "CheklistForm"
        },
        massSendSMS     :   {
            display     :   "Массовая рассылка СМС",
            dispForm    :   "msgMassSendForm"
        },
        initClients     :   {
            display     :   "Восстановление пользователей",
            dispForm    :   "initClientsForm"
        }
        
    };
    
    
    self.actionListDisplay = new cmn.ActionList(self.actionList, document.getElementById("actionPanel"));
    cmn.addTopRightControl("Выход", "log-out", Logout);
}
