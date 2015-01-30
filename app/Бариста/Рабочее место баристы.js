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
    var whAdd = null;
    var dashboard, itemSelector, modifiers;
    
    var chekLists = new CheckLists();
    settings = new ServerModule('Settings');
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
    
    function initTradePanels() {
            dashboard = cmn.createElement('div', 'dashboard', "mainArea");
            itemSelector = cmn.createElement('div', 'item_selector col-sm-8 row', dashboard);
            modifiers = cmn.createElement('div', 'modifiers col-sm-4 row', dashboard);
            self.clientSelector = new ClientPhoneSelector(self);
            self.orderList = new OrderList(self);
            self.cashBackCalc = new CashBackCalculator(self, itemSelector);
            self.itemsSelector = new ItemsSelector(itemSelector, self, session.tradePoint);
            self.typesSelector = new TypesSelector(modifiers, self, session.tradePoint);
            self.priceModifier = new PriceModifier(modifiers, self, session.tradePoint);
    }
    
    function setSession(aSession) {
        if (aSession) {
            Logger.info('Сессия открыта ' + aSession);
            session.activeSession = aSession;
            model.getSessions.params.session_id = aSession;
            showChecklist('cheklist_open');
            model.getSessions.requery(function() {
                if (!model.getSessions.empty) {
                    session.tradePoint = model.getSessions.trade_point;
                    model.qTradePoint.params.trade_point_id = session.tradePoint;
                    model.qTradePoint.requery(function() {
                        if (!model.qTradePoint.empty) {
                            cmn.addHeaderLeft(model.qTradePoint.cursor.tp_name + '<b> @ </b>' +
                                    model.qTradePoint.cursor.tp_address, "asterisk");
                        }
                    });
                    initTradePanels();
                }
            });
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
        
    session.getActiveTPSession(function(aSession) {
        setSession(aSession);
    });

    session.sessionKeeper.showIndicator(document.body);
    
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

    self.actionList = {
        manageItems :   {
            display     :   "Управление позициями",
            onClick     :   setActionsViewEnabled,
            defEnabled  :   true
        },
        back    :   {
            display     :   "В торговлю",
            onClick     :   function() {alert('В торговлю');}
        }
    };
    
    var actionList;
    var actionListEnabled = false;
    function setActionsViewEnabled() {
        if (!actionListEnabled) {
            actionListEnabled = true;
            self.clientSelector.hide();
            self.orderList.hide();
            if (actionList) {
                actionList.show();
            } else {
                actionList = new wf.ActionList(self.actionList, "actionPanel");
            }
        }
    }

////    var AS = new AdditionalScreen();
//    var BC;
//    var BC = new addItem();
//    var fmDev = new fmDevMode();
//    fmDev.show();
/* function openDigitalMenu(){
        if (!BC)
            require('addItemToDashboard', function() {
                BC = new addItemToDashboard();
                BC.showModal();
            });
        else {
            BC.showModal();
        }
    }*/
        //cmn.addTopRightControl("Меню в окне", "plus-sign", openDigitalMenu);
//        cmn.addTopRightControl("Прием товара", "plus-sign", btnWarehouseAddActionPerformed);
//        cmn.addTopRightControl("Закрыть смену", "log-out", btnSessionCloseActionPerformed);
        cmn.addTopRightControl("Настройка", "briefcase", setActionsViewEnabled);
        cmn.addTopRightControl("Выход", "log-out", Logout);

    function btnWarehouseAddActionPerformed(evt) {//GEN-FIRST:event_btnWarehouseAddActionPerformed
        if (!whAdd) {
            whAdd = new WHSetAddMovement();
            whAdd.setTradePoint(session.tradePoint);
        }
        whAdd.show();
    }//GEN-LAST:event_btnWarehouseAddActionPerformed
}
