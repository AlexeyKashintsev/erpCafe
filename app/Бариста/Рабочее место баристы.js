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
    self.widgetCreator = new WidgetCreator();

    function setSession(aSession) {
        if (aSession) {
            Logger.info('Сессия открыта ' + aSession);
            model.params.session_id = aSession;
            session.activeSession = aSession;
            //session.whSession.setCurrentSession(aSession);
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
                    alert('Склад не инициализирован');
                    Logger.warning("Склад не инициализирован. Инфо о сессии " + session);
                    var whInitializer = new WhRevisionByBarista();
                    whInitializer.setTradePoint(aTradePoint);
                    whInitializer.showModal(function() {
                        session.getActiveTPSession(function(aSession) {
                            session.tradeSession.initializeSession(aSession, prompt("Введите остаток по кассе", "0")); // Ввести остаток по кассе, иницировать сессию
                            setSession(aSession);
                        });
                    });
                }
            });
        }
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
        MenuWindow = window.open("menu.html","menu",'width=550,height=650');
    }
    


    function tradeItemsByTradePointWithCostOnRequeried(evt) {//GEN-FIRST:event_tradeItemsByTradePointWithCostOnRequeried
        model.tradeItemsByTradePointWithCost.beforeFirst();
        while (model.tradeItemsByTradePointWithCost.next()) {
            var data = model.tradeItemsByTradePointWithCost.cursor;
            new self.widgetCreator.tradeItem("mainArea", data,
                function(aData) {
                    self.orderList.addItem(aData);
                    if (MenuWindow){
                        MenuWindow.addItem(aData.item_name);
                        
                    }
                });
        }
    }//GEN-LAST:event_tradeItemsByTradePointWithCostOnRequeried

    function getSessionsOnRequeried(evt) {//GEN-FIRST:event_getSessionsOnRequeried
        if (!model.getSessions.empty) {
            session.tradePoint = model.getSessions.trade_point;
            model.params.trade_point_id = session.tradePoint;
            model.tradeItemsByTradePointWithCost.params.franchazi_id = session.franchaziId;
            model.tradeItemsByTradePointWithCost.params.actual_date = new Date();
            model.tradeItemsByTradePointWithCost.params.trade_point_id = session.tradePoint;
            model.tradeItemsByTradePointWithCost.execute();
        }
    }//GEN-LAST:event_getSessionsOnRequeried

    function btnSessionCloseActionPerformed(evt) {//GEN-FIRST:event_btnSessionCloseActionPerformed
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
}
