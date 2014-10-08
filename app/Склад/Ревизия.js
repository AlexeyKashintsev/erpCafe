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
    self.close = false;
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
    
    function closeSession(anItems){
        if(whSessionModule.closeSessionByRevision(anItems))
            alert("Ревизя успешно проведена");
        else alert("Возникли ошибки");
    }
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        getStartValues();
        self.close = false;
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
        closeSession(self.end_items);
        self.close = true;
        form.close();
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if(!self.close){
            if(confirm("Отменить ревизию? Все конечные значения будут заполнены началаьными значениями.")){
                model.itemsByTP.beforeFirst();
                while (model.itemsByTP.next()) {
                    self.end_items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
                }
                console.log(self.end_items);
                closeSession(self.end_items);
            }
        }
    }//GEN-LAST:event_formWindowClosing
}
