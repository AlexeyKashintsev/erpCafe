/**
 * 
 * @author Alexey
 */
function BaristaDesktop() {
    var self = this, model = this.model, form = this;
    self.tradeItems = {};
    
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
        self.browser = true;
        Logger.info('browser');
//        document.getElementById("logActionNav").innerHTML = 
//                '<li><a id="whAddItems" href="#"><span class="glyphicon glyphicon-plus-sign"></span>  Прием товара</a></li>\n\
//                 <li><a id="Logout" href="#"><span class="glyphicon glyphicon-log-out"></span>  Закрыть смену</a></li>'
//        document.getElementById("whAddItems").onclick = btnWarehouseAddActionPerformed;
//        document.getElementById("Logout").onclick = btnSessionCloseActionPerformed;
    }
    self.orderList = new OrderList(self);
    self.orderList.tradeSession = self.tradeSession;

    function setSession(aSession) {
        if (aSession) {
            Logger.info('Сессия открыта ' + aSession);
            model.params.session_id = aSession;
            self.whSession.setCurrentSession(aSession);
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
        var itemPanel = document.createElement('div');
        var itemDesc = document.createElement('h4');
        var itemCost = document.createElement('h1');
        var itemType = document.createElement('p');
        
        itemPanel.className = "itemDescription col-md-2 col-sm-4";
        itemDesc.className = "itemDesc";
        itemCost.className = "itemCost";
        itemType.className = "itemType";
        
        itemDesc.innerHTML = aData.item_name;
        itemType.innerHTML = aData.type_name;
        itemCost.innerHTML = aData.item_cost;
        
        itemPanel.appendChild(itemDesc);
        itemPanel.appendChild(itemType);
        itemPanel.appendChild(itemCost);
        
        itemPanel.onclick = function() {
            self.orderList.addItem(aData);
        };
        
        document.getElementById("mainArea").appendChild(itemPanel);
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
            model.tradeItemsByTradePointWithCost.params.trade_point_id =
                    model.getSessions.trade_point;
            //self.orderList.showOnPanel(self.browser ? "actionPanel" : form.pnlLeft);
            model.tradeItemsByTradePointWithCost.execute();
        }
    }//GEN-LAST:event_getSessionsOnRequeried

    function btnSessionCloseActionPerformed(evt) {//GEN-FIRST:event_btnSessionCloseActionPerformed
        self.whSession.closeSession();
        logout();
    }//GEN-LAST:event_btnSessionCloseActionPerformed

    function btnWarehouseAddActionPerformed(evt) {//GEN-FIRST:event_btnWarehouseAddActionPerformed
        if (!whAdd) {
            whAdd = new WHSetAddMovement();
            whAdd.setTradePointId(model.getSessions.trade_point);
        }
        whAdd.showModal();
    }//GEN-LAST:event_btnWarehouseAddActionPerformed

    if (self.browser) {
        common.addTopRightControl("Прием товара", "plus-sign", btnWarehouseAddActionPerformed);
        common.addTopRightControl("Закрыть смену", "log-out", btnSessionCloseActionPerformed);
    }
}
