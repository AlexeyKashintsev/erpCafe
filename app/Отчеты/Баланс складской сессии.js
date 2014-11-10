/**
 * 
 * @author Alexey
 */
function WHSessionBalance(aContainer) {
    var self = this, model = this.model;
    self.container = cmn.createElement("table", "table table-hover whSessionBalance", aContainer);
    var items = [];
    var shown = false;
    var doUpdate = false;
    
    function showItems() {
        Logger.info("Отображение данных для торговой точки " + model.params.trade_point_id);
        if (self.container&&!shown) {
            var thead = cmn.createElement('thead', null, self.container, 'wh_item_title');
            var tr = cmn.createElement('tr', null, thead);
            var nameLabel = cmn.createElement('th', 'whItemDesc', tr);
            nameLabel.innerHTML = "Наименование";
            var startValue = cmn.createElement('th', 'whItemDesc', tr);
            startValue.innerHTML = "Остаток на начало смены";
            var usedValue = cmn.createElement('th', 'whItemDesc', tr);
            usedValue.innerHTML = "Расход";
            var currentValue = cmn.createElement('th', 'whItemDesc', tr);
            currentValue.innerHTML = "Текущий остаток";
            
            var tbody = cmn.createElement('tbody', null, self.container, 'wh_item_title');
            for (var j in items) {
                if (!items[j].shown) {
                    tr = cmn.createElement('tr', 'whItemContainer ', tbody, 'wh_item_' + j);
                    items[j].setContainer(tr);
                }
                items[j].visualize();
            }
            shown = true;
        }
    };
    /* var item = {
     item_name    :  '',
     item_id      :  0,
     item_measure :  '',
     startV  :   0,
     usedV   :   0,
     finalV  :   0,
     endV    :   0
     };*/
    function Item(anItemData) {
        var tItem = this;
        tItem.item_id = anItemData.item_id;
        tItem.item_name = anItemData.item_name;
        tItem.item_measure = anItemData.item_measure;
        
        var container = null;
        tItem.shown = false;

        tItem.setData = function(aData) {
            var changed = false;
            if (!!aData.start_value && tItem.startV !== aData.start_value) {
                tItem.startV = aData.start_value;
                changed = true;
            }
            if (!!aData.used_value && tItem.usedV !== aData.used_value) {
                tItem.usedV = aData.used_value;
                changed = true;
            }
            if (!!aData.end_value && tItem.endV !== aData.end_value) {
                tItem.endV = aData.end_value;
                changed = true;
            }
            if (!!aData.final_value && tItem.finalV !== aData.final_value) {
                tItem.finalV = aData.final_value;
                changed = true;
            }
            if (changed && container) {
                tItem.visualize();
            }
        };
        
        function ItemView() {
            tItem.shown = true;
            this.nameLabel = cmn.createElement('td', 'whItemDesc col-xs-4', container);
            this.nameLabel.innerHTML = tItem.item_name;
            this.startValue = cmn.createElement('td', 'whItemDesc col-xs-2', container);
            this.usedValue = cmn.createElement('td', 'whItemDesc col-xs-2', container);
            this.currentValue = cmn.createElement('td', 'whItemDesc col-xs-2', container);
        }
        
        tItem.setContainer = function(aContainer) {
            container = aContainer;
            tItem.visualize();
        };
        
        tItem.visualize = function() {
            if (container && !tItem.shown)
                tItem.view = new ItemView();
            tItem.view.startValue.innerHTML = (tItem.startV ? tItem.startV : "--") + ' ' + tItem.item_measure;
            tItem.view.usedValue.innerHTML = (tItem.usedV ? tItem.usedV : "--") + ' ' + tItem.item_measure;
            tItem.view.currentValue.innerHTML = (tItem.finalV ? tItem.finalV : "--") + ' ' + tItem.item_measure;
        };
        
        tItem.destroy = function() {
            if (tItem.view) 
                $(tItem.view).remove();
            delete tItem;
        };
    }

    self.setWarehouse = function(aWarehouse) {
        model.params.trade_point_id = aWarehouse;
    };

    self.setTradePoint = self.setWarehouse;

    self.setSession = function(aSession) {
        model.qWHSessionBalance.params.session_id = aSession;
        if (doUpdate) updateSessionData();
        doUpdate = true;
    };
    
    function updateSessionData() {
        Logger.info("Получение баланса. Склад: " + model.params.trade_point_id + ", идентификатор сессии " + model.qWHSessionBalance.params.session_id);
        model.qWHSessionBalance.execute(function() {
            model.qWHSessionBalance.beforeFirst();
            while (model.qWHSessionBalance.next()) {
                items[model.qWHSessionBalance.cursor.item_id].setData(model.qWHSessionBalance.cursor);
            }
            showItems();
        });
    };

    function itemsByTPOnRequeried(evt) {//GEN-FIRST:event_itemsByTPOnRequeried
        Logger.info("Получены складские позиции по точке: " + model.params.trade_point_id 
                + ' В количестве ' + model.itemsByTP.length);
        model.itemsByTP.beforeFirst();
        for (var j in items)
            items[j].destroy();
        while (model.itemsByTP.next()) {
            items[model.itemsByTP.cursor.item_id] = new Item(model.itemsByTP.cursor);
        }
        if (doUpdate) updateSessionData();
        doUpdate = true;
    }//GEN-LAST:event_itemsByTPOnRequeried
}