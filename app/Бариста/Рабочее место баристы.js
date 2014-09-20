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
    
    //Определяем как запущена программа
    self.browser = false;
    try {
        (function(){
            self.browser = false;
        }).invokeBackground();
    } catch (e) {
        self.browser = true;
        Logger.info('browser');
    }
    
    self.orderList = new OrderList(self);
    self.orderList.tradeSession = session.tradeSession;

    function setSession(aSession) {
        if (aSession) {
            Logger.info('Сессия открыта ' + aSession);
            model.params.session_id = aSession;
            session.activeSession = aSession;
            session.whSession.setCurrentSession(aSession);
            model.getSessions.requery();
        } else {//открываем новую сессию
            //Выбираем торговую точку
            //Вводим остатки по складу
            //Вводим остатки по кассе
            Logger.info('Создание новой сессии');
            var tpSelector = new TradePointSelector();
            tpSelector.userName = self.userName;
            tpSelector.showModal(function(aTradePoint){
                if (!aTradePoint) Logout();
                session.tradePoint = aTradePoint;
                var whInitializer = new WhRevisionByBarista();
                whInitializer.setTradePoint(aTradePoint);
                whInitializer.showModal(function() {
                    session.getActiveTPSession(function(aSession){
                        session.tradeSession.initializeSession(aSession, prompt("Введите остаток по кассе", "0")); // Ввести остаток по кассе, иницировать сессию
                        setSession(aSession);
                    });
                });
            });
        }
    }
    
    function setFranchazi(aFranchazi) {
        if (!aFranchazi) Logout();
        
        model.tradeItemsByTradePointWithCost.params.franchazi_id = aFranchazi;
        model.tradeItemsByTradePointWithCost.params.actual_date = new Date();
        
        session.getActiveTPSession(function(aSession){
            setSession(aSession);
        });
    }
    
    if (self.browser)
        session.login(function(){
            session.getFranchazi(
                    function(aFranchazi){setFranchazi(aFranchazi);
            });
        });
    else {
        session.login();
        setFranchazi(session.getFranchazi());
    }
    
    function addItemSE(anItemData) {
       //requery(['ProductItem'],function(){
            var itemForm = new ProductItem(self);
            var itemPanel = new AnchorsPane();
            itemForm.data = anItemData;
            self.tradeItems[model.tradeItemsByTradePointWithCost.item_id] = itemForm;
            itemForm.showOnPanel(itemPanel);
            form.pnlRigth.add(itemPanel);
        //});
    }
    
    function addItemBrowser(aData) {
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
             if (self.browser) {
                 addItemBrowser(model.tradeItemsByTradePointWithCost.cursor);
             } else
                 addItemSE(model.tradeItemsByTradePointWithCost.cursor);
        }
    }//GEN-LAST:event_tradeItemsByTradePointWithCostOnRequeried

    function getSessionsOnRequeried(evt) {//GEN-FIRST:event_getSessionsOnRequeried
        if (!model.getSessions.empty){
            session.tradePoint = model.getSessions.trade_point
            model.tradeItemsByTradePointWithCost.params.trade_point_id = session.tradePoint;
            model.tradeItemsByTradePointWithCost.execute();
        }
    }//GEN-LAST:event_getSessionsOnRequeried

    function btnSessionCloseActionPerformed(evt) {//GEN-FIRST:event_btnSessionCloseActionPerformed
        session.whSession.closeSession();
        Logout();
    }//GEN-LAST:event_btnSessionCloseActionPerformed

    function btnWarehouseAddActionPerformed(evt) {//GEN-FIRST:event_btnWarehouseAddActionPerformed
        if (!whAdd) {
            whAdd = new WHSetAddMovement();
            //whAdd.setTradePoint(session.tradePoint);
        }
        whAdd.show();
    }//GEN-LAST:event_btnWarehouseAddActionPerformed

    if (self.browser) {
        cmn.addTopRightControl("Прием товара", "plus-sign", btnWarehouseAddActionPerformed);
        cmn.addTopRightControl("Закрыть смену", "log-out", btnSessionCloseActionPerformed);
        cmn.addTopRightControl("Выход", "log-out", Logout);
    }
}
