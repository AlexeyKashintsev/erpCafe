/**
 * 
 * @author Alexey
 * @module
 */ 
function ItemsSelector(aContainer, aParent, aTradePoint, anActualDate) {
    var self = this, model = this.model;
    var IWF = new ItemsWidgetFactory();
    self.parent = aParent;
    
    $( aContainer ).disableSelection();
    var items_body = cmn.createElement('div', 'items_select row', aContainer);
    
    var trade_items = {};
    
    self.setSortable = function(aSortable) {
        if (aSortable) {
            $( ".items_select" ).sortable({dropOnEmpty : false, containment : "parent",
            opacity:0.55, revert: true, delay: 150, helper: 'clone', update:
                function() {
                    var order = $(this).sortable('serialize');
                    settings.setSettings('TradeItemsOrder', order, null, model.params.trade_point_id);
                }});       
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
    
    function processItemClick(anItemData) {
        self.parent.orderList.addItem(anItemData);
    }
    
    function TradeItem(anItemData) {
        var ti = this;
        var costs = [];
        var priceTypeSel = null;

        ti.setCost = function(aPriceType, aCost) {
            if (!!aCost)
                costs[aPriceType] = aCost;
            else
                delete costs[aPriceType];
        };

        ti.setActivePriceType = function(aPriceType) {
            if (costs[aPriceType]) {
                this.view.setDisplayedPrice(costs[aPriceType] + 'р.');
                priceTypeSel = aPriceType;
            } else
                this.view.setDisplayedPrice('---');
         };

        ti.setAdditionalData = function(aData) {
            ti.setCost(aData.price_type, aData.item_cost);
        };
        
        ti.view = new IWF.tradeItem(items_body, anItemData, processItemClick);
        ti.setAdditionalData(anItemData);
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
        self.setSortable(true);
    });
}
