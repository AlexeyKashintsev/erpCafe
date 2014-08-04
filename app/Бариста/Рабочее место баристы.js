/**
 * 
 * @author Alexey
 */
function BaristaDesktop() {
    var self = this, model = this.model, form = this;
    self.tradeItems = {};
    self.orderList = new OrderList();
    self.session = new ServerModule('UserSession');
    self.whSession = new ServerModule("WhSessionModule");
    self.tradeSession = new ServerModule("TradeSessions");
    self.userName = self.session.getUserName();
    
    var whAdd = null;
    
    //Определяем как запущена программа
    self.browser = false;
    try {
        (function(){
            self.browser = false;
        }).invokeBackground();
    } catch (e) {
        Logger.info('browser');
        self.browser = true;
    }

    function setSession(aSession) {
        if (aSession) {
            Logger.info('Сессия открыта ' + aSession);
            model.params.session_id = aSession;
            model.getSessions.requery();
        } else {//открываем новую сессию
            //Выбираем торговую точку
            //Вводим остатки по складу
            //Вводим остатки по кассе
            Logger.info('Создание новой сессии');
            var tpSelector = new TradePointSelector();
            tpSelector.userName = self.userName;
            tpSelector.showModal(function(aTradePoint){
                if (!aTradePoint) logout();
                var whInitializer = new WhRevisionByBarista(self.whSession);
                //self.whSession.setTradePoint(aTradePoint);
                whInitializer.setTradePointId(aTradePoint);
                whInitializer.showModal(function() {
                    if (self.browser) 
                        self.session.getActiveTPSession(function(aSession){
                            self.tradeSession.initializeSession(aSession, 0); // Ввести остаток по кассе, иницировать сессию
                            setSession(aSession);
                        });
                    else {
                        var session = self.session.getActiveTPSession();
                        self.tradeSession.initializeSession(session, 0);// Тоже самое
                        setSession(session);
                    }
                });
            });
        }
    }
    
    function setFranchazi(aFranchazi) {
        if (!aFranchazi) logout();
        model.tradeItemsByTradePointWithCost.params.franchazi_id = aFranchazi;
        model.tradeItemsByTradePointWithCost.params.actual_date = new Date();
        
        if (self.browser) 
            self.session.getActiveTPSession(function(aSession){setSession(aSession);});
        else 
            setSession(self.session.getActiveTPSession());
    }
    
    if (self.browser)
        self.session.login(function(){
            self.session.getFranchazi(
                    function(aFranchazi){setFranchazi(aFranchazi);
            });
        });
    else {
        self.session.login();
        setFranchazi(self.session.getFranchazi());
    }

    function tradeItemsByTradePointWithCostOnRequeried(evt) {//GEN-FIRST:event_tradeItemsByTradePointWithCostOnRequeried
        model.tradeItemsByTradePointWithCost.beforeFirst();
        while (model.tradeItemsByTradePointWithCost.next()) {
             var itemForm = new ProductItem(self);
             var itemPanel = self.browser ? document.createElement('div') : new AnchorsPane();
             itemForm.data = model.tradeItemsByTradePointWithCost.cursor;
             self.tradeItems[model.tradeItemsByTradePointWithCost.item_id] = itemForm;
             itemForm.showOnPanel(itemPanel);
             if (self.browser) {
                 itemPanel.className = "itemDescription";
                 document.getElementById("mainArea").appendChild(itemPanel);
             } else
                 form.pnlRigth.add(itemPanel);
        }
    }//GEN-LAST:event_tradeItemsByTradePointWithCostOnRequeried

    function getSessionsOnRequeried(evt) {//GEN-FIRST:event_getSessionsOnRequeried
        if (!model.getSessions.empty){
            model.tradeItemsByTradePointWithCost.params.trade_point_id =
                    model.getSessions.trade_point;
            self.orderList.showOnPanel(self.browser ? "actionPanel" : form.pnlLeft);
            model.tradeItemsByTradePointWithCost.execute();
        }
    }//GEN-LAST:event_getSessionsOnRequeried

    function btnSessionCloseActionPerformed(evt) {//GEN-FIRST:event_btnSessionCloseActionPerformed
        //self.session.
    }//GEN-LAST:event_btnSessionCloseActionPerformed

    function btnWarehouseAddActionPerformed(evt) {//GEN-FIRST:event_btnWarehouseAddActionPerformed
        if (!whAdd) {
            whAdd = new WHSetAddMovement();
            whAdd.setTradePointId(model.getSessions.trade_point);
        }
        whAdd.showModal();
    }//GEN-LAST:event_btnWarehouseAddActionPerformed
}
