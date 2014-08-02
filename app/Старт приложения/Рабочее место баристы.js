/**
 * 
 * @author Alexey
 */
function BaristaDesktop() {
    var self = this, model = this.model, form = this;
    self.tradeItems = {};
    var orderList = new OrderList();
    self.session = new ServerModule('UserSession');  
    self.userName = self.session.getUserName();
    
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
            model.params.session_id = aSession;
            model.getSessions.requery();
        } else {//открываем новую сессию
            //Выбираем торговую точку
            //Вводим остатки по складу
            //Вводим остатки по кассе
            
            var tpSelector = new TradePointSelector();
            tpSelector.userName = self.userName;
            tpSelector.showModal(function(aTradePoint){
                if (!aTradePoint) self.close();
                var whInitializer = new WhRevisionByBarista();
                whInitializer.setTradePointId(aTradePoint);
                whInitializer.showModal(function() {
                            //TODO ввести остатки по кассе!!!
                    if (self.browser) 
                        self.session.getActiveTPSession(function(aSession){setSession(aSession);});
                    else setSession(self.session.getActiveTPSession());
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
        self.session.login(function(aFranchazi){setFranchazi(aFranchazi);});
    else
        setFranchazi(self.session.login());

    function tradeItemsByTradePointWithCostOnRequeried(evt) {//GEN-FIRST:event_tradeItemsByTradePointWithCostOnRequeried
        model.tradeItemsByTradePointWithCost.beforeFirst();
        while (model.tradeItemsByTradePointWithCost.next()) {
             var itemForm = new ProductItem();
             var itemPanel = new AnchorsPane();
             itemForm.data = model.tradeItemsByTradePointWithCost.cursor;
             self.tradeItems[model.tradeItemsByTradePointWithCost.item_id] = itemForm;
             itemForm.showOnPanel(itemPanel);
             form.pnlRigth.add(itemPanel);
        }
    }//GEN-LAST:event_tradeItemsByTradePointWithCostOnRequeried

    function getSessionsOnRequeried(evt) {//GEN-FIRST:event_getSessionsOnRequeried
        if (!model.getSessions.empty){
            model.tradeItemsByTradePointWithCost.params.trade_point_id =
                    model.getSessions.cursor.trade_point;
            orderList.showOnPanel(form.pnlLeft);
            model.tradeItemsByTradePointWithCost.execute();
        }
    }//GEN-LAST:event_getSessionsOnRequeried
}
