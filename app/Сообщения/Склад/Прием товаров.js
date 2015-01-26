/**
 * 
 * @author Алексей
 * @name GetItemsByBaristaForm
 * @public
 */

function WHSetAddMovement() {
var MSG_SESSION_CLOSED_ERROR = "Сначала нужно открыть смену!";
var MSG_SET_MOVEMENTS_ERROR  = "Произошла ошибка при добавлении товара!";

var self = this, model = this.model, form = this;
var whSession = session.whSession ? session.whSession : new ServerModule("WhSessionModule");
model.params.trade_point_id = null;

self.setTradePoint = function(aTradePointId) {
    model.params.trade_point_id = aTradePointId;
};

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    //self.setTradePoint(session.tradePoint);
    form.btnProceed.enabled = true;
    if(!model.params.trade_point_id) {
        alert(MSG_SESSION_CLOSED_ERROR);
        form.close();
    }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing

}//GEN-LAST:event_formWindowClosing

    function btnProceedActionPerformed(evt) {//GEN-FIRST:event_btnProceedActionPerformed
         var items = {};
         model.itemsByTP.beforeFirst();
         while(model.itemsByTP.next()){
             if(model.itemsByTP.cursor.start_value != null) {
                 items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
             }
         }
         whSession.setTradePoint(model.params.trade_point_id);
         if (whSession.whMovement(items, whSession.getSelfPropertyValue("WH_ADD_ITEMS"))) 
            form.close();
         else
             alert(MSG_SET_MOVEMENTS_ERROR);
    }//GEN-LAST:event_btnProceedActionPerformed
}