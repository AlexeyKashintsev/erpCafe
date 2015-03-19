/**
 * 
 * @author Alexey
 * @module
 */ 
function ItemsSelector(aContainer, aParent, aTradePoint, anActualDate) {
    var self = this, model = this.model;
    self.mode = 0; //0 - продажа товаров, 1 - настройка
    self.parent = aParent;
    self.itemSettingsAndCost = new ItemSettingsAndCost();
    var addItemWidget;
    balanceMeter = new BalanceMeter();
    var whSession = session.whSession;
    
    self.modes = {
        TRADE   :   0,
        SETUP   :   1
    };
    
    $( aContainer ).disableSelection();
    var items_body = cmn.createElement('div', 'items_select row', aContainer);
    
    var trade_items = {};
    var bar_codes = {};
    
    self.reloadItems = function() {
        for (var j in trade_items) {
            cmn.deleteElement(trade_items[j].dockElement);
            delete trade_items[j];
        };
            
        getItems();
    };
    
    self.reloadItemsLimit = function() {
        var limits = [];
        for (var j in trade_items) {
            limits.push(j);
        };
        limits = whSession.getItemsLimit(limits);
        for (var j in limits)
            trade_items[limits[j].itemOnTPID].setLimit(limits[j].limit);
    };
    
    self.barCodeEnter = function(aBarcode) {
        if (bar_codes[aBarcode])
            trade_items[bar_codes[aBarcode]].addToOrder();
        else
            new Alerter(null, "alert-danger", "Товар по коду не найден!", true, 3000);
    };
    
    self.setOperationMode = function(aMode) {
        self.mode = aMode;
        switch (aMode) {
            case (self.modes.SETUP) : {
                bcp.listen = false;
                if (!addItemWidget)
                    addItemWidget = new TradeItemAdd(self, items_body);
                addItemWidget.show();
                self.setSortable(true);
                break;
            }
            case (self.modes.TRADE) : {
                bcp.listen = true;
                if (addItemWidget)
                    addItemWidget.hide();
                self.setSortable(false);
                break;
            }
        }
    };
    
    self.setSortable = function(aSortable) {
        if (aSortable) {
            $( ".items_select" ).sortable({dropOnEmpty : false, containment : "parent",
            opacity:0.55, revert: true, delay: 150, helper: 'clone', update:
                function() {
                    var order = $(this).sortable('serialize');
                    settings.setSettings('TradeItemsOrder', order, null, model.params.trade_point_id);
                }});
            $( ".items_select" ).sortable( "enable" );
        } else {
            $( ".items_select" ).sortable( "disable" );
        }
    };
    
    self.setActivePrice = function(aPriceType) {
        for (var ti in trade_items) {
            trade_items[ti].setActivePriceType(aPriceType);
        }
    };
    
    function getSort() {
        var sortOrder = settings.getSettingByName('TradeItemsOrder');
        sortOrder = sortOrder.split('&');
        $.each(sortOrder, function () {
            $('#' + this.replace('[]=', '_')).appendTo(".items_select");
        });
    }
    
    function getItemsTypes() {
        model.tradeTypes4TP.params.trade_point_id = aTradePoint;
        model.tradeTypes4TP.params.actual_date = anActualDate ? anActualDate : new Date();
        model.tradeTypes4TP.requery(function() {
            model.tradeTypes4TP.forEach(function(aTTData) {
                trade_items[aTTData.items_on_tp_id].addType(aTTData.type_id);
            });
        });
    }
    
    function getItems(aCallback) {
        model.tradeItemsCostByTP.params.trade_point_id = aTradePoint;
        model.tradeItemsCostByTP.params.actual_date = anActualDate ? anActualDate : new Date();
        model.tradeItemsCostByTP.requery(function() {
            model.tradeItemsCostByTP.forEach(function(aTIData) {
                if (aTIData.bar_code)
                    bar_codes[aTIData.bar_code] = aTIData.items_on_tp_id;
                if (!trade_items[aTIData.items_on_tp_id])
                    trade_items[aTIData.items_on_tp_id] = new TradeItem(aTIData, self, items_body);
                else
                    trade_items[aTIData.items_on_tp_id].setAdditionalData(aTIData);
            });
            getSort();
            self.reloadItemsLimit();
            if (aCallback)
                aCallback();
        });    
    }
    
    getItems(function() {
        self.setActivePrice(10);
        getItemsTypes();
    });
    bcp.action = self.barCodeEnter;
}
