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
                    alert('Склад не инициализирован');//TODO Запись в лог
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
        cmn.addTopRightControl("Прием товара", "plus-sign", btnWarehouseAddActionPerformed);
        cmn.addTopRightControl("Закрыть смену", "log-out", btnSessionCloseActionPerformed);
        cmn.addTopRightControl("Выход", "log-out", Logout);
        
        session.getActiveTPSession(function(aSession) {
            setSession(aSession);
        });
        
        self.orderList = new OrderList(self);
        
        session.sessionKeeper.showIndicator(document.body);
    }

    function addTradeItem(aData) {
        var itemContainer = cmn.createElement("div", "itemDescription col-xs-4 col-sm-3 col-lg-2 tt_"
                + aData.trade_item_type_id + (aData.classtag ? " " + aData.classtag : ""), "mainArea");
        var itemPanel = cmn.createElement("div", "panel panel-primary", itemContainer);
        var itemHeading = cmn.createElement("div", "panel-heading", itemPanel);
        var itemDesc = cmn.createElement("h3", "panel-title itemDesc", itemHeading);
        var itemContent = cmn.createElement("div", "panel-body", itemPanel);
        var itemCost = cmn.createElement("h1", "itemCost", itemContent);
        var itemType = cmn.createElement("p", "itemType", itemContent);

        itemDesc.innerHTML = aData.item_name;
        itemType.innerHTML = aData.type_name;
        itemCost.innerHTML = aData.item_cost + 'р.';

        itemPanel.onclick = function() {
            self.orderList.addItem(aData);
        };
    }

    function tradeItemsByTradePointWithCostOnRequeried(evt) {//GEN-FIRST:event_tradeItemsByTradePointWithCostOnRequeried
        model.tradeItemsByTradePointWithCost.beforeFirst();
        while (model.tradeItemsByTradePointWithCost.next()) {
                addTradeItem(model.tradeItemsByTradePointWithCost.cursor);
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
            //cmn.addHeaderLeft(model.qTradePoint.cursor.tp_address, "envelope");
        }
    }//GEN-LAST:event_qTradePointOnRequeried
    
    startBaristaDesktop();
}
