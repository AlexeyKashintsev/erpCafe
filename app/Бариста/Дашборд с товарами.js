/**
 * 
 * @author Alexey
 * @module
 */ 
function ItemsChooser(aTradePoint, aContainer, orderList) {
    var self = this, model = this.model;
    
    var widjetFactory = !!widgetCreator ? widgetCreator : new WidgetCreatorBaristaDesktop();
    var settings = Session.get('Settings');
    settings.updateSettingsParams(null, aTradePoint);
    
    $( aContainer ).disableSelection();
    var types_body = cmn.createElement('div', 'item_type_selector row', aContainer);
    var items_body = cmn.createElement('div', 'row items_select', aContainer);
    var trade_items = [];
    
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
            model.tradeTypes4TP.beforeFirst();
            while (model.tradeTypes4TP.next()) {
                var data = model.tradeTypes4TP.cursor;
                buttons[data.trade_item_type_id] = {
                    d_name  :   data.type_name,
                    d_title :   null
                };
            }
            new cmn.ButtonGroup(buttons, types_body, "typeSelector", onTypeClick);
        }
    }//GEN-LAST:event_tradeTypes4TPOnRequeried

    function setSortable(aSortable, aSelector) {
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
                    trade_items.push(new widgetCreator.tradeItem(items_body, data, processItemClick));
                data = model.tradeItemsCostByTP.cursor;
                data.cost = {};
            }
            data.cost[model.tradeItemsCostByTP.cursor.price_type] = 
                            model.tradeItemsCostByTP.cursor.item_cost;
        }
    }//GEN-LAST:event_tradeItemsCostByTPOnRequeried
}
