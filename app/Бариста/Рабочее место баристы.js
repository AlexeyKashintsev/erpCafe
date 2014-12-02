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
    var whAdd = null;
    var types_body;
    var items_body;
    
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
        checklist = chekLists.showCheklist(checklist.id);
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
                  /*  var whInitializer = new WhRevisionByBarista();
                    whInitializer.setTradePoint(aTradePoint);
                    whInitializer.showModal(function() {
                        session.getActiveTPSession(function(aSession) {*/
                            //session.tradeSession.initializeSession(aSession, prompt("Введите остаток по кассе", "0")); // Ввести остаток по кассе, иницировать сессию
                            //setSession(aSession);
                      //  });
                  //  });
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
        
        types_body = cmn.createElement('div', 'item_type_selector row', "mainArea");
        items_body = cmn.createElement('div', 'row items_select', "mainArea");
        self.orderList = new OrderList(self);
        
        session.sessionKeeper.showIndicator(document.body);
    }
    
    function openDigitalMenu(){
       AS.openWin();
    }
    
    function addItemToOrder(anItemData) {
        self.orderList.addItem(anItemData);
    }

    function tradeItemsByTradePointWithCostOnRequeried(evt) {//GEN-FIRST:event_tradeItemsByTradePointWithCostOnRequeried
        model.tradeItemsByTradePointWithCost.beforeFirst();
        while (model.tradeItemsByTradePointWithCost.next()) {
            var data = model.tradeItemsByTradePointWithCost.cursor;
            new widgetCreator.tradeItem(items_body, data, addItemToOrder);
        }
        
        $( ".items_select" ).sortable({dropOnEmpty : false, containment : "parent",
            opacity:0.55, revert: true, helper: 'clone', update:
                function() {
                    var order = $(this).sortable('serialize');
                    settings.setSettings('TradeItemsOrder', order, null, model.params.trade_point_id);
                }});
        $( ".itemDescription" ).disableSelection();
        
        var sortOrder = settings.getSettingByName('TradeItemsOrder');
        sortOrder = sortOrder.split('&');
        $.each(sortOrder, function () {
            $('#' + this.replace('[]=', '_')).appendTo(".items_select");
        });
    }//GEN-LAST:event_tradeItemsByTradePointWithCostOnRequeried

    function getSessionsOnRequeried(evt) {//GEN-FIRST:event_getSessionsOnRequeried
        if (!model.getSessions.empty) {
            session.tradePoint = model.getSessions.trade_point;
            model.params.trade_point_id = session.tradePoint;
            model.tradeItemsByTradePointWithCost.params.franchazi_id = session.franchaziId;
            model.tradeItemsByTradePointWithCost.params.actual_date = new Date();
            model.tradeItemsByTradePointWithCost.params.trade_point_id = session.tradePoint;
            model.tradeItemsByTradePointWithCost.execute();
            
            model.tradeTypes4TP.params.franchazi_id = session.franchaziId;
            model.tradeTypes4TP.params.actual_date = new Date();
            model.tradeTypes4TP.params.trade_point_id = session.tradePoint;
            model.tradeTypes4TP.execute();
        }
    }//GEN-LAST:event_getSessionsOnRequeried

    function btnSessionCloseActionPerformed(evt) {//GEN-FIRST:event_btnSessionCloseActionPerformed
        showChecklist('cheklist_close');
        session.tradeSession.calculateFinalValues();
        session.whSession.closeSession();
        Logout();
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
    
    var onTypeClick = function(aTypeID) {
        if (aTypeID == 0) {
            $('.itemDescription').show();
        } else {
            $('.itemDescription').hide();
            $('.itemDescription.tt_' + aTypeID).show();
        }
    };
    
    function tradeTypes4TPOnRequeried(evt) {//GEN-FIRST:event_tradeTypes4TPOnRequeried
        if (!model.tradeTypes4TP.empty) {
            var buttons = [{d_name : 'Все', active : true}];
            model.tradeTypes4TP.beforeFirst();
            while (model.tradeTypes4TP.next()) {
                var data = model.tradeTypes4TP.cursor;
                buttons[data.trade_item_type_id] = {
                    d_name  :   data.type_name,
                    d_title :   null
                };
            }
            new cmn.ButtonGroup(buttons, types_body, "typeSelector", onTypeClick);
        }
    }//GEN-LAST:event_tradeTypes4TPOnRequeried
}
