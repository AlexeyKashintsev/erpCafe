/**
 * 
 * @author Alexey
 * @module
 */ 
function TradeOperationsInSession(aContainer, aSessionId) {
    var self = this, model = this.model;
    var header = ["Время", "Позиция", "Сумма"];
    self.container = cmn.createElement("div", "", aContainer);
    var grid = new wf.Table(self.container, header);
    var du = new DatesUtils();
    
    self.setSession = function(aSession) {
        grid.prepare();
        model.params.session_id = aSession;
    };
    
    if (aSessionId)
        self.setSession(aSessionId);
    
    function dsTradeOperationsInSessionOnRequeried(evt) {//GEN-FIRST:event_dsTradeOperationsInSessionOnRequeried
        model.dsTradeOperationsInSession.beforeFirst();
        var data = [];
        var prevOperation = null;
        
        model.dsTradeOperationsInSession.forEach(function (md) {
            if (!!prevOperation && md.trade_cash_box_operation_id === prevOperation.id) {
                prevOperation.items.push([md.item_name, md.items_quantity + md.item_measure]);
            } else {
                if (prevOperation)
                    data.push([prevOperation.time, prevOperation.items,
                               prevOperation.sum + " р. " + prevOperation.pay_type]);
                prevOperation = {};
                prevOperation.id = md.trade_cash_box_operation_id;
                prevOperation.time = du.timeToShortString(md.operation_date);
                prevOperation.sum = md.operation_sum;
                prevOperation.pay_type = md.type_name;
                prevOperation.items = [];
                prevOperation.items.push([md.item_name, md.items_quantity + md.item_measure]);
            }
        });
        
        grid.setData(data);
    }//GEN-LAST:event_dsTradeOperationsInSessionOnRequeried
}
