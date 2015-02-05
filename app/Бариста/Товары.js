/**
 * 
 * @author Alexey
 * @module
 */ 
function ItemsSelector(aContainer, aParent, aTradePoint, anActualDate) {
    var self = this, model = this.model;
    var mode = 0; //0 - продажа товаров, 1 - настройка
    self.parent = aParent;
    var itemSettingsAndCost = new ItemSettingsAndCost();
    var addItemWidget;
    
    self.modes = {
        TRADE   :   0,
        SETUP   :   1
    };
    
    $( 'body' ).disableSelection();
    var items_body = cmn.createElement('div', 'items_select row', aContainer);
    
    var trade_items = {};
    
    self.setOperationMode = function(aMode) {
        mode = aMode;
        switch (aMode) {
            case (self.modes.SETUP) : {
                if (!addItemWidget)
                    addItemWidget = null;
                self.setSortable(true);
                break;
            }
            case (self.modes.TRADE) : {
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

    function TradeItem(anItemData) {
        //var this = this;
        var costs = [];
        var priceTypeSel = null;
        this.data = anItemData;
        
        this.setCost = function(aPriceType, aCost) {
            if (!!aCost)
                costs[aPriceType] = aCost;
            else
                delete costs[aPriceType];
        };

        this.setActivePriceType = function(aPriceType) {
            if (costs[aPriceType]) 
                this.setDisplayedPrice(costs[aPriceType] + 'р.');
            else 
                this.setDisplayedPrice('---');
            priceTypeSel = aPriceType;
         };

        this.setAdditionalData = function(aData) {
            this.setCost(aData.price_type, aData.item_cost);
        };
        
        function addToOrder() {
            if (costs[priceTypeSel]) {
                if (!this.data.item_measure || this.data.item_measure == 'шт' || this.data.item_measure == '-') {
                    self.parent.orderList.addItem(this.data, priceTypeSel, costs[priceTypeSel]);
                } else {
                    //TODO Ввод веса товара
                }
            } else {
                //TODO Ошибка - данный товар проверять нельзя по выбранной цене
            }
        }
        
        function settingsShow() {
            itemSettingsAndCost.setTradeItem(this.data.item_id);
            itemSettingsAndCost.showModal();
        }
        
        this.click = (function() {
            switch (mode) {
                case 0  :   {
                        addToOrder.bind(this)();
                        break;
                }
                case 1  :   {
                        settingsShow.bind(this)();
                        break;
                }
            }
            
        }).bind(this);
        
        wf.TradeItem.bind(this)(items_body);
        this.setAdditionalData(anItemData);
    }

    model.tradeItemsCostByTP.params.trade_point_id = aTradePoint;
    model.tradeItemsCostByTP.params.actual_date = anActualDate ? anActualDate : new Date();
    model.tradeItemsCostByTP.requery(function() {
        model.tradeItemsCostByTP.forEach(function(aTIData) {
            if (!trade_items[aTIData.item_id])
                trade_items[aTIData.item_id] = new TradeItem(aTIData);
            else
                trade_items[aTIData.item_id].setAdditionalData(aTIData);
        });
        self.setActivePrice(10);
        getSort();
    });
}
