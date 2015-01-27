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
    var trade_items = [];
    var cost_modifiers = [];
    
    model.params.actual_date = new Date();
    model.params.trade_point_id = aTradePoint;
    model.params.price_type = 10; //TODO Расхардкодить тип цены
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
    
    function tradeItemsCostByTPOnRequeried(evt) {//GEN-FIRST:event_tradeItemsCostByTPOnRequeried
        var data = null;
        model.tradeItemsCostByTP.beforeFirst();
        while (model.tradeItemsCostByTP.next()) {
            if (!data || data.item_id !== model.tradeItemsCostByTP.cursor.item_id) {
                if (!!data)
                    trade_items.push(new IWF.tradeItem(items_body, data, processItemClick));
                data = model.tradeItemsCostByTP.cursor;
                data.cost = {};
            }
            data.cost[model.tradeItemsCostByTP.cursor.price_type] = 
                            model.tradeItemsCostByTP.cursor.item_cost;
        }
        if (!!data)
            trade_items.push(new IWF.tradeItem(items_body, data, processItemClick));
    }//GEN-LAST:event_tradeItemsCostByTPOnRequeried

    function qCostModifiersOnTPOnRequeried(evt) {//GEN-FIRST:event_qCostModifiersOnTPOnRequeried
        model.qCostModifiersOnTP.forEach(function(aCostModifier) {
            cost_modifiers.push(new IWF.priceModifier(modifiers_body, aCostModifier, null));
        });
    }//GEN-LAST:event_qCostModifiersOnTPOnRequeried
}
