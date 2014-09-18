/**
 * 
 * @author Алексей
 * @name WhRevisionByBarista
 * @public
 */

function WhRevisionByBarista() {
    var MSG_RESET_VALUES = "Cбросить значения?";
    var MSG_FAIL_VALIDATE_FORM_ERROR = "Вы заполнили не все поля!";
    var self = this, model = this.model, form = this;
    var startWORevision = false;
    
    //model.params.trade_point_id = 3;
    self.setTradePoint = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
        model.params.session_id = session.whSession.setTradePoint(model.params.trade_point_id);
    };

    self.items = [];

    function getStartValues() {
        self.items = session.whSession.getStartValues(model.params.trade_point_id);
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
        form.btnStartSession.enabled = true;
        self.items = session.whSession.getCurrentStartValues();
        model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next()) {
            model.itemsByTP.cursor.start_value = self.items[model.itemsByTP.cursor.item_id];
        }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (!startWORevision) {
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
            session.whSession.setStartValues(items, model.params.trade_point_id);
            return true;
        } else {
            alert(MSG_FAIL_VALIDATE_FORM_ERROR);
            return false;
        }
    } else {
        session.whSession.setStartValuesAuto(model.params.trade_point_id);
        return true;
    }
}//GEN-LAST:event_formWindowClosing

    function btnStartSessionActionPerformed(evt) {//GEN-FIRST:event_btnStartSessionActionPerformed
        form.close(true);
    }//GEN-LAST:event_btnStartSessionActionPerformed

    function btnWORevisionActionPerformed(evt) {//GEN-FIRST:event_btnWORevisionActionPerformed
        startWORevision = true;
        form.close();
        /*model.itemsByTP.beforeFirst();
        while (model.itemsByTP.next())
            model.itemsByTP.cursor.start_value = 100;*/
    }//GEN-LAST:event_btnWORevisionActionPerformed
}