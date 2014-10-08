/**
 * 
 * @author minya92
 */
function RevisionForm() {
    var self = this, model = this.model, form = this;
    var whSessionModule = new ServerModule("WhSessionModule");
    
    self.setTradePoint = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
    };
    
    self.items = [];

    function getStartValues() {
        whSessionModule.setTradePoint(model.params.trade_point_id);
        var session_id = whSessionModule.createSession();
        whSessionModule.setStartValuesAuto(model.params.trade_point_id);
        self.items = whSessionModule.getCurrentStartValues();
        console.log(self.items);
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            model.itemsByTP.cursor.start_value = self.items[model.itemsByTP.cursor.item_id];
        }
        whSessionModule.closeSession();
    }

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        getStartValues();
    }//GEN-LAST:event_formWindowOpened
}
