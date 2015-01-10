/**
 * 
 * @author Alexey
 */
function BaristaDesktop() {
    var self = this, model = this.model, form = this;
    self.tradeItems = {};
    session.whSession = new ServerModule("WhSessionModule");
    session.tradeSession = new ServerModule("TradeSessions");
    self.userName = session.getUserName();
    var AS = new AdditionalScreen();
    var BC = new addItemToDashboard();
    //var BC = new addItem();
    var whAdd = null;
    var types_body;
    var items_body;
    var itemsChooser;
    
    widgetCreator = new WidgetCreatorBaristaDesktop();
//    var fmDev = new fmDevMode();
//    fmDev.show();
    self.cashBackCalc = new CashBackCalculator(self);
    var chekLists = new CheckLists();
    var settings = new ServerModule('Settings');
    settings.updateSettingsParams();
    
    /*
     * aName - Название чеклиста (cheklist_open, cheklist_close)
     * return object{
     *      cheklist_text  : 
     *      cheklist_title :
     *      cheklist_type  :
     * }
     */
    function showChecklist(aName){
        settings.getSettings(false, session.tradePoint);
        var checklist = settings.getSettingByName(aName);
        if(checklist){
            checklist = chekLists.showCheklist(checklist.id);
            return true;
        } else return false; 
    }
    
    function setSession(aSession) {
        if (aSession) {
            Logger.info('Сессия открыта ' + aSession);
            model.params.session_id = aSession;
            session.activeSession = aSession;
            showChecklist('cheklist_open');
            model.getSessions.requery();
        } else {//открываем новую сессию
            //Выбираем торговую точку
            //Вводим остатки по складу
            //Вводим остатки по кассе
            Logger.info('Создание новой сессии');
            var tpSelector = new TradePointSelector();
            tpSelector.userName = self.userName;
            tpSelector.showModal(function(aTradePoint) {
                if (!aTradePoint)
                    Logout();
                session.tradePoint = aTradePoint;
                if (!session.whSession.setTradePoint(aTradePoint)) 
                if (session.whSession.createSession()) {
                    session.activeSession = session.whSession.getCurrentSession();
                    session.tradeSession.initializeSession(session.activeSession, prompt("Введите остаток по кассе", "0"));
                    setSession(session.activeSession);
                } else {
                    alert('Склад не инициализирован! Проведите ревизию');
                    Logger.warning("Склад не инициализирован. Инфо о сессии " + session);
                    Logout();
                }
            });
        }
    }
    
    function closeSessionAndLogout() {
        //TODO subj и добавить в асинхронный вызов после отображения чеклиста
    }
    
    function startBaristaDesktop() {
        cmn.addTopRightControl("Меню в окне", "plus-sign", openDigitalMenu);
        cmn.addTopRightControl("Прием товара", "plus-sign", btnWarehouseAddActionPerformed);
        cmn.addTopRightControl("Закрыть смену", "log-out", btnSessionCloseActionPerformed);
        cmn.addTopRightControl("Выход", "log-out", Logout);
        
        session.getActiveTPSession(function(aSession) {
            setSession(aSession);
        });
        
        self.orderList = new OrderList(self);
        
        session.sessionKeeper.showIndicator(document.body);
    }
    
    function openDigitalMenu(){
       //AS.openWin();
       BC.showModal();
    }
    
    function addItemToOrder(anItemData) {
        self.orderList.addItem(anItemData);
    }

    function getSessionsOnRequeried(evt) {//GEN-FIRST:event_getSessionsOnRequeried
        if (!model.getSessions.empty) {
            session.tradePoint = model.getSessions.trade_point;
            model.params.trade_point_id = session.tradePoint;
            itemsChooser = new ItemsChooser(session.tradePoint, "mainArea", self.orderList);
          /*  model.tradeItemsByTradePointWithCost.params.franchazi_id = session.franchaziId;
            model.tradeItemsByTradePointWithCost.params.actual_date = new Date();
            model.tradeItemsByTradePointWithCost.params.trade_point_id = session.tradePoint;
            model.tradeItemsByTradePointWithCost.execute();
            
            model.tradeTypes4TP.params.franchazi_id = session.franchaziId;
            model.tradeTypes4TP.params.actual_date = new Date();
            model.tradeTypes4TP.params.trade_point_id = session.tradePoint;
            model.tradeTypes4TP.execute();*/
        }
    }//GEN-LAST:event_getSessionsOnRequeried
    
    function closeSessionAndLogout() {
                session.tradeSession.calculateFinalValues();
                session.whSession.closeSession();
                Logout();
    };
    
    function btnSessionCloseActionPerformed(evt) {//GEN-FIRST:event_btnSessionCloseActionPerformed
        if(showChecklist('cheklist_close')){
            $('#modalForm').on('hidden.bs.modal', closeSessionAndLogout);
        } else {
            closeSessionAndLogout(); 
        }
    }//GEN-LAST:event_btnSessionCloseActionPerformed

    function btnWarehouseAddActionPerformed(evt) {//GEN-FIRST:event_btnWarehouseAddActionPerformed
        if (!whAdd) {
            whAdd = new WHSetAddMovement();
            whAdd.setTradePoint(session.tradePoint);
        }
        whAdd.show();
    }//GEN-LAST:event_btnWarehouseAddActionPerformed

    function qTradePointOnRequeried(evt) {//GEN-FIRST:event_qTradePointOnRequeried
        if (!model.qTradePoint.empty) {
            cmn.addHeaderLeft(model.qTradePoint.cursor.tp_name + '<b> @ </b>' +
                    model.qTradePoint.cursor.tp_address, "asterisk");
        }
    }//GEN-LAST:event_qTradePointOnRequeried
    
    startBaristaDesktop();
    

    
    function tradeItemsByTradePointWithCostOnRequeried(evt) {//GEN-FIRST:event_tradeItemsByTradePointWithCostOnRequeried
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_tradeItemsByTradePointWithCostOnRequeried

    function tradeTypes4TPOnRequeried(evt) {//GEN-FIRST:event_tradeTypes4TPOnRequeried
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_tradeTypes4TPOnRequeried
}
