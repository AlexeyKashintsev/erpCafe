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
    self.end_items = [];

    function getStartValues() {
        whSessionModule.setTradePoint(model.params.trade_point_id);
        var session_id = whSessionModule.createSession(false, true);
        whSessionModule.setStartValuesAuto();
        self.items = whSessionModule.getCurrentStartValues();
        console.log(self.items);
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            model.itemsByTP.cursor.start_value = self.items[model.itemsByTP.cursor.item_id];
        }
    }

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            if(model.itemsByTP.cursor.end_value){
                self.end_items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.end_value;
            } else {
                self.end_items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
            }
        }
        console.log(self.end_items);
        if(whSessionModule.closeSessionByRevision(self.end_items))
            alert("123");
    }//GEN-LAST:event_buttonActionPerformed

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        getStartValues();
    }//GEN-LAST:event_button1ActionPerformed
}
