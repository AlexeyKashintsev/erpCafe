/**
 * 
 * @author Алексей
 * @name WhRevisionByBarista
 * @public
 */

function WhRevisionByBarista(aWhSessionModule) {
    var MSG_RESET_VALUES = "Cбросить значения?";
    var MSG_FAIL_VALIDATE_FORM_ERROR = "Вы заполнили не все поля!";
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var whSessionModule = aWhSessionModule ? aWhSessionModule : new ServerModule("WhSessionModule");
    
    //model.params.trade_point_id = 3;
    self.setTradePointId = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
        model.params.session_id = whSessionModule.setTradePoint(model.params.trade_point_id);/*, function(){
            model.params.session_id = whSessionModule.createSession();
        });*/
    };

    self.items = [];

    function getStartValues() {
        self.items = whSessionModule.getStartValues(model.params.trade_point_id);
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            model.itemsByTP.cursor.start_value = self.items[model.itemsByTP.cursor.item_id];
        }
    }

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (confirm(MSG_RESET_VALUES)) {
            getStartValues();
        }
}//GEN-LAST:event_btnReqActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        form.btnCloseSession.enabled = true;
        self.items = whSessionModule.getStartValues();
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            model.itemsByTP.cursor.start_value = self.items[model.itemsByTP.cursor.item_id];
        }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        var items = {}, check = true;
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            items[model.itemsByTP.cursor.item_id] = model.itemsByTP.cursor.start_value;
            if (model.itemsByTP.cursor.start_value === null) {
                check = false;
            }
        }
        if (check) {
           // whSessionModule.model.params.trade_point_id = model.params.trade_point_id;//!!Косяк - stateless module
            whSessionModule.setStartValues(items, model.params.trade_point_id);
            return true;
        } else {
            alert(MSG_FAIL_VALIDATE_FORM_ERROR);
            return false;
        }
}//GEN-LAST:event_formWindowClosing

    function btnCloseSessionActionPerformed(evt) {//GEN-FIRST:event_btnCloseSessionActionPerformed
        form.close(true);
    }//GEN-LAST:event_btnCloseSessionActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next())
            model.itemsByTP.cursor.start_value = 100;
    }//GEN-LAST:event_buttonActionPerformed
}