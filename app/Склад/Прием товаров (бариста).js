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

self.setTradePoint = function(aTradePointId) {
    model.params.trade_point_id = aTradePointId;
    if (aTradePointId !== session.tradePoint) {
        //TODO Дописать
    } else {
        model.params.session_id = session.activeSession;
    }
};

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    self.setTradePoint(session.tradePoint);
    form.btnProceed.enabled = true;
    if(!model.params.session_id) {
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
         if (session.whSession.whMovement(items, session.whSession.WH_ADD_ITEMS)) 
            form.close();
         else
             alert(MSG_SET_MOVEMENTS_ERROR);
    }//GEN-LAST:event_btnProceedActionPerformed
}