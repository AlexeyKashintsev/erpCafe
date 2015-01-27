/**
 * 
 * @author Alexey
 * @module
 */ 
function ItemsChooser(aTradePoint, aContainer, orderList) {
    var self = this, model = this.model;
    var IWF = new ItemsWidgetFactory();
    var settings = Session.get('Settings');
    settings.updateSettingsParams(null, aTradePoint);
    
    $( aContainer ).disableSelection();
    var selector_body = cmn.createElement('div', 'item_selector col-sm-7 row', aContainer);
    var types_body = cmn.createElement('div', 'item_type_selector row', selector_body);
    var items_body = cmn.createElement('div', 'items_select row', selector_body);
    var modifiers_body = cmn.createElement('div', 'modifier_selector col-sm-5', aContainer);
    var trade_items = {};
    var cost_modifiers = [];
    
    model.params.actual_date = new Date();
    model.params.trade_point_id = aTradePoint;
    model.tradeItemsCostByTP.requery();
    model.tradeTypes4TP.requery();
    
    function onTypeClick(aTypeID) {
        if (aTypeID == 0) {
            $('.itemDescription').show();
        } else {
            $('.itemDescription').hide();
            $('.itemDescription.tt_' + aTypeID).show();
        }
    };

    function tradeTypes4TPOnRequeried(evt) {//GEN-FIRST:event_tradeTypes4TPOnRequeried
        if (!model.tradeTypes4TP.empty) {
            var buttons = [{d_name : 'Все', active : true}];
            model.tradeTypes4TP.forEach(function(data) {
                buttons[data.trade_item_type_id] = {
                    d_name  :   data.type_name,
                    d_title :   null
                };
            });
            new cmn.ButtonGroup(buttons, types_body, "typeSelector", onTypeClick);
        }
    }//GEN-LAST:event_tradeTypes4TPOnRequeried

    function setSortable(aSortable) {
        if (aSortable) {
            $( ".items_select" ).sortable({dropOnEmpty : false, containment : "parent",
            opacity:0.55, revert: true, delay: 150, helper: 'clone', update:
                function() {
                    var order = $(this).sortable('serialize');
                    settings.setSettings('TradeItemsOrder', order, null, model.params.trade_point_id);
                }});       
        }
    }
    
    function getSort() {
        var sortOrder = settings.getSettingByName('TradeItemsOrder');
        sortOrder = sortOrder.split('&');
        $.each(sortOrder, function () {
            $('#' + this.replace('[]=', '_')).appendTo(".items_select");
        });
    }
    
    function processItemClick(anItemData) {
        orderList.addItem(anItemData);
    }
    
    function processPriceTypeClick(aPriceData) {
        //alert(trade_items.length);
//        trade_items.forEach(function(ti) {
//            ti.setActivePriceType(aPriceData.price_type);
//        });
        for (var j in trade_items) {
            trade_items[j].setActivePriceType(aPriceData.price_type);
        }
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
    
    function tradeItemsCostByTPOnRequeried(evt) {//GEN-FIRST:event_tradeItemsCostByTPOnRequeried
        model.tradeItemsCostByTP.forEach(function(aTIData) {
            if (!trade_items[aTIData.item_id])
                trade_items[aTIData.item_id] = new TradeItem(aTIData);
            else
                trade_items[aTIData.item_id].setAdditionalData(aTIData);
        });
    }//GEN-LAST:event_tradeItemsCostByTPOnRequeried

    function qCostModifiersOnTPOnRequeried(evt) {//GEN-FIRST:event_qCostModifiersOnTPOnRequeried
        model.qCostModifiersOnTP.forEach(function(aCostModifier) {
            cost_modifiers.push(new IWF.priceModifier(modifiers_body, aCostModifier, processPriceTypeClick));
        });
    }//GEN-LAST:event_qCostModifiersOnTPOnRequeried
}
