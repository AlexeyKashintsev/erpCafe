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
    
    self.modes = {
        TRADE   :   0,
        SETUP   :   1
    };
    
    $( aContainer ).disableSelection();
    var items_body = cmn.createElement('div', 'items_select row', aContainer);
    
    var trade_items = {};
    var bar_codes = {};
    
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

    model.tradeItemsCostByTP.params.trade_point_id = aTradePoint;
    model.tradeItemsCostByTP.params.actual_date = anActualDate ? anActualDate : new Date();
    model.tradeItemsCostByTP.requery(function() {
        model.tradeItemsCostByTP.forEach(function(aTIData) {
            if (aTIData.bar_code)
                bar_codes[aTIData.bar_code] = aTIData.item_id;
            if (!trade_items[aTIData.item_id])
                trade_items[aTIData.item_id] = new TradeItem(aTIData, self, items_body);
            else
                trade_items[aTIData.item_id].setAdditionalData(aTIData);
        });
        self.setActivePrice(10);
        getSort();
    });
    bcp.ti = self;
}
