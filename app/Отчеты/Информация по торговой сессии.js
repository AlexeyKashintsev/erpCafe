/**
 * 
 * @author Alexey
 * @module
 */ 
function commonSessionInfo(aContainer) {
    var self = this, model = this.model;
    self.container = cmn.createElement("table", "table table-hover whSessionBalance", aContainer);
    var items = {
        trade_point  :   {
            title           :   "Торговая точка",
            title_container :   null,
            value           :   null,
            value_container :   null
        },
        user_name   : {title    :   "Пользователь"},
        start_date  : {title    :   "Открытие"},
        end_date    : {title    :   "Закрытие"},
        start_value : {title    :   "Касса открытие", def : ' р.'},
        end_value   : {title    :   "Касса закрытие", def : ' р.'},
        operationsSum   : {title    :   "Доход", def : ' р.'},
        operationsCount : {title    :   "Количество покупок"},
        soldItemsQuantity   : {title    :   "Объем продажи"}
    };
    var shown = false;
    var doUpdate = false;
    
    function updateValues() {
        for (var j in items) {
            items[j].value = model.tradeSessionDetails.cursor[j];
            if (items[j].value_container)
                items[j].value_container.innerHTML = items[j].value;
        }
    }
    
    self.setSession = function(aSession) {
        model.params.session_id = aSession;
    };
    
    self.show = function() {
        if (!shown) {
            var thead = cmn.createElement('thead', null, self.container, 'wh_item_title');
            var tr = cmn.createElement('tr', null, thead);
            var nameLabel = cmn.createElement('th', 'whItemDesc', tr);
            nameLabel.innerHTML = "Параметр";
            var startValue = cmn.createElement('th', 'whItemDesc', tr);
            startValue.innerHTML = "Значение";
            
            var tbody = cmn.createElement('tbody', null, self.container, 'wh_item_title');
            for (var j in items) {
                tr = cmn.createElement('tr', 'whItemContainer ', tbody, 'wh_item_' + j);
                items[j].title_container = cmn.createElement('td', 'whItemDesc col-xs-4', tr);
                items[j].title_container.innerHTML = items[j].title;
                items[j].value_container = cmn.createElement('td', 'whItemDesc col-xs-4', tr);
                items[j].value_container.innerHTML = items[j].value ? 
                    (items[j].value + (items[j].def ? items[j].def : ""))
                    : '-';
            }
        }
    };
    
    self.show();

    function tradeSessionDetailsOnRequeried(evt) {//GEN-FIRST:event_tradeSessionDetailsOnRequeried
        updateValues();
    }//GEN-LAST:event_tradeSessionDetailsOnRequeried
}
