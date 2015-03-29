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
    var dashboard, itemSelector, modifiers, reportView, whView, devSetView;
    var tsReport, whReplenish, devSettings;
    
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
    
    var panelSettings = {
        clientSelector : false,
        modifiersOnTop : true,
        typeModifiers : true,
        priceModifiers : false,
        priceModBeforeItems : true
    };
    function initTradePanels() {
            dashboard = cmn.createElement('div', 'dashboard', "mainArea");
            self.cashBackCalc = new CashBackCalculator(self, dashboard);
            if (!panelSettings.priceModBeforeItems) {
                itemSelector = cmn.createElement('div', '', dashboard);
                modifiers = cmn.createElement('div', '', dashboard);
            } else {
                modifiers = cmn.createElement('div', '', dashboard);
                itemSelector = cmn.createElement('div', '', dashboard);
            }
            
            
            CSS_M.registerHTMLComponent(itemSelector, 'itemSelector');
            CSS_M.registerHTMLComponent(modifiers, 'selectorModifiers');
            
            self.clientSelector = new ClientPhoneSelector(self, panelSettings.clientSelector)
            new OrderList(self);
            self.itemsSelector = new ItemsSelector(itemSelector, self, session.tradePoint);
            itemsBoard = self.itemsSelector;
            if (panelSettings.typeModifiers)
                self.typesSelector = new TypesSelector(modifiers, self, session.tradePoint);
            if (panelSettings.priceModifiers)
                self.priceModifier = new PriceModifier(modifiers, self, session.tradePoint);
            //self.chat = new MyChat(modifiers); self.chat.initChat();
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

    function showReport() {
        if (!reportView)
            reportView = cmn.createElement('div', 'dashboard report row', "mainArea");
        $(reportView).show();
        $(devSetView).hide();
        $(dashboard).hide();
        $(whView).hide();
        if (!tsReport)
            tsReport = new commonSessionInfo(reportView);
        tsReport.setSession(session.activeSession);
    }
    
    function showDevSettings() {
        if (!devSetView)
            devSetView = cmn.createElement('div', 'dashboard report row', "mainArea");
        $(devSetView).show();
        $(reportView).hide();
        $(dashboard).hide();
        $(whView).hide();
        if (!devSettings)
            devSettings = new DeviceSettings(devSetView);
    }
    
    function replenishWH() {
        if (!whView)
            whView = cmn.createElement('div', 'dashboard report row', "mainArea");
        $(whView).show();
        $(devSetView).hide();
        $(reportView).hide();
        $(dashboard).hide();
        if (!whReplenish)
            whReplenish = new WHSetAddMovement();
        whReplenish.setTradePoint(session.tradePoint);
        whReplenish.manualShow(whView);
        //whReplenish.showOnPanel(whView);// setSession(session.activeSession);
    }
    
    var actionList;
    var actionListEnabled = false;
    function setActionsViewEnabled() {
        if (!actionListEnabled) {
            actionListEnabled = true;
            self.clientSelector.hide();
            orderList.hide();
            if (actionList) {
                actionList.show();
            } else {
                actionList = new wf.ActionList(self.actionList, "actionPanel");
            }
        } else {
            actionListEnabled = false;
            self.clientSelector.show();
            orderList.show();
            actionList.hide();
            setModeSellItems();
        }
    }
    
    function setModeManageItems() {
        $(reportView).hide();
        $(whView).hide();
        $(devSetView).hide();
        $(dashboard).show();
        self.itemsSelector.setOperationMode(self.itemsSelector.modes.SETUP);
        //self.typesSelector.setOperationMode(self.typesSelector.modes.SETUP);
        
    }
    
    function setModeSellItems() {
        $(reportView).hide();
        $(whView).hide();
        $(devSetView).hide();
        $(dashboard).show();
        self.itemsSelector.setOperationMode(self.itemsSelector.modes.TRADE);
        //self.typesSelector.setOperationMode(self.typesSelector.modes.TRADE);
    }
    
    self.actionList = {
        back    :   {
            display     :   "Назад",
            onClick     :   setActionsViewEnabled,
            doNotActivate   :   true
        },
        manageItems :   {
            display     :   "Управление позициями",
            onClick     :   setModeManageItems,
            defEnabled  :   true
        },
        replenishWHItems  :   {
            display     :   "Пополнение склада",
            onClick     :   replenishWH
        },
        report  :   {
            display     :   "Общий отчет",
            onClick     :   showReport
        },
        deviceSettings  :   {
            display     :   "Настройка оборудования",
            onClick     :   showDevSettings
        },
        closeAndExit    :   {
            display     :   "Закрыть смену и выйти",
            onClick     :   closeSessionAndLogout
        },
        exit    :   {
            display     :   "Выход",
            onClick     :   Logout
        }
    };
//    var fmDev = new fmDevMode();
//    fmDev.show();

    document.getElementById('top-navbar').onclick = setActionsViewEnabled;

    function btnWarehouseAddActionPerformed(evt) {//GEN-FIRST:event_btnWarehouseAddActionPerformed
        if (!whAdd) {
            whAdd = new WHSetAddMovement();
            whAdd.setTradePoint(session.tradePoint);
        }
        whAdd.show();
    }//GEN-LAST:event_btnWarehouseAddActionPerformed
}
