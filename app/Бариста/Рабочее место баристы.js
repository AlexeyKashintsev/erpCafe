/**
 * 
 * @author Alexey
 */
function BaristaDesktop() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    self.tradeItems = {};
    self.session = units.userSession;
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
    
    /*function addItemSE(anItemData) {
       //requery(['ProductItem'],function(){
            var itemForm = new ProductItem(self);
            var itemPanel = new AnchorsPane();
            itemForm.data = anItemData;
            self.tradeItems[model.tradeItemsByTradePointWithCost.item_id] = itemForm;
            itemForm.showOnPanel(itemPanel);
            form.pnlRigth.add(itemPanel);
        //});
    }*/
    
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

    model.tradeItemsByTradePointWithCost.onRequeried = function(evt) {
        model.tradeItemsByTradePointWithCost.beforeFirst();
        while (model.tradeItemsByTradePointWithCost.next()) {             
             if (self.browser) {
                 addItemBrowser(model.tradeItemsByTradePointWithCost.cursor);
             } else
                 addItemSE(model.tradeItemsByTradePointWithCost.cursor);
        }
    };

    model.getSessions.onRequeried = function(evt) {
        if (!model.getSessions.empty){
            model.tradeItemsByTradePointWithCost.params.trade_point_id =
                    model.getSessions.trade_point;
            //self.orderList.showOnPanel(self.browser ? "actionPanel" : form.pnlLeft);
            model.tradeItemsByTradePointWithCost.execute();
        }
    };

    form.btnSessionClose.onActionPerformed = function(evt) {
        self.whSession.closeSession();
            logout();
    };

    form.btnWarehouseAdd.onActionPerformed = function(event) {
        if (!whAdd) {
            whAdd = new WHSetAddMovement();
            whAdd.setTradePointId(model.getSessions.trade_point);
        }
        whAdd.show();
    };

    if (self.browser) {
        cmn.addTopRightControl("Прием товара", "plus-sign", form.btnWarehouseAdd.onActionPerformed);
        cmn.addTopRightControl("Закрыть смену", "log-out", form.btnSessionClose.onActionPerformed);
    }
    
    self.show = function() {
        form.show();
    };
}
