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
    self.end_items = {};
    self.session_id;
    self.closing = false;
    function getStartValues() {
        whSessionModule.setTradePoint(model.params.trade_point_id);
        self.session_id = whSessionModule.createSession(false, true);
        whSessionModule.setStartValuesAuto();
        self.items = whSessionModule.getCurrentStartValues();
        console.log(self.items);
        if (model.itemsByTP.length > 0) {
            model.itemsByTP.beforeFirst();
            while (model.itemsByTP.next()) {
                model.itemsByTP.cursor.start_value = self.items[model.itemsByTP.cursor.item_id];
            }
        }
    }
    
    function closeSession(anItems){
        if(whSessionModule.closeSessionByRevision(anItems))
            alert("Ревизя успешно проведена");
        else alert("Возникли ошибки");
    }
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        getStartValues();
        self.closing = false;
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
        self.closing = true;
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if(!self.closing){
            if(confirm("Отменить ревизию? Несохраненные данные будут потеряны!")){
                whSessionModule.delRevision(self.session_id);
            } else return false;
        }
    }//GEN-LAST:event_formWindowClosing

    function itemsByTPOnRequeried(evt) {//GEN-FIRST:event_itemsByTPOnRequeried
        if (self.items.length > 0) {
            model.itemsByTP.beforeFirst();
            while (model.itemsByTP.next()) {
                model.itemsByTP.cursor.start_value = self.items[model.itemsByTP.cursor.item_id];
            }
        }
    }//GEN-LAST:event_itemsByTPOnRequeried

    function button1ActionPerformed(evt) {//GEN-FIRST:event_button1ActionPerformed
        if(self.session_id){
            whSessionModule.delRevision(self.session_id);
            self.closing = true;
        }
        form.close(true);
    }//GEN-LAST:event_button1ActionPerformed
}
