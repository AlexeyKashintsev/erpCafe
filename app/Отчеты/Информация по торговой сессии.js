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
            title   :   "Торговая точка",
            value   :   null,
            value_container :   null
        },
        user_name   :   {title   :   "Пользователь"},
        start_date  : {},
        end_date    : {},
        start_value : {},
        end_value   : {},
        operationsSum   : {},
        operationsCount : {},
        soldItemsQuantity   : {}
    };
    var shown = false;
    var doUpdate = false;
    
    self.setSession = function(aSession) {
        model.params.session_id = aSession;
    };
    
}
