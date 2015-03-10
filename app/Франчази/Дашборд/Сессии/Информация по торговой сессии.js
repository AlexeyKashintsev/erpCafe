/**
 * 
 * @author Alexey
 * @module
 */ 
function commonSessionInfo(aContainer) {
    var self = this, model = this.model;
    //self.container = cmn.createElement("table", "table table-hover whSessionBalance", aContainer);
    var header = ['Параметр', 'Значение'];
    var grid = new wf.Table(aContainer, header);
    self.container = grid.dockElement;
    var items = {
        trade_point  :   {
            title           :   "Торговая точка",
            title_container :   null,
            value           :   null,
            value_container :   null
        },
        user_name   :   {title    :   "Пользователь"},
        start_date  :   {title    :   "Открытие смены"},
        end_date    :   {title    :   "Закрытие смены"},
        start_value :   {title    :   "Касса открытие", def : ' р.'},
        cash_sum    :   {title    :   "Приход наличные", def : ' р.'},
        bank_sum    :   {title    :   "Приход безнал", def : ' р.'},
        bonus_sum   :   {title    :   "Бонусы", def : ' р.'},
        takeback_sum    :   {title    :   "Снято с кассы", def : ' р.'},
        current_cash    :   {title    :   "Текущий баланс", def : ' р.'},
        end_value   :   {title    :   "Касса закрытие", def : ' р.'}
    };
    var shown = false;
    var doUpdate = false;
    
    function updateValues() {
        var data = [];
        for (var j in items) {
            items[j].value = model.tradeSessionDetails.cursor[j];
            data.push([items[j].title,
                items[j].value !== null ? (items[j].value + (items[j].def ? items[j].def : "")) : '---']);
        }
        
        grid.setData(data);
    }
    
    self.setSession = function(aSession) {
        model.tradeSessionDetails.params.session_id = aSession;
        model.tradeSessionDetails.requery(updateValues);
    };
}
