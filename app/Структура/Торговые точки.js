/**
 * 
 * @author Алексей
 * @name TradePoints
 * @public
 */

function TradePoints() {
var self = this, model = this.model, form = this;

var isSelectForm = false;
//self.addButtons = true;

model.params.franchazi_id = null;

self.setFranchazi = function(aFranchaziId){
    model.params.franchazi_id = aFranchaziId;
    model.listTradePoints.requery();
};

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    self.model.save();
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    if (!isSelectForm){
        self.pnlSelLock.visible = false;
        form.btnAdd.visible = form.btnDel.visible = self.addButtons;
    }
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        close(model.listTradePoints.org_trade_point_id);
    }//GEN-LAST:event_btnSelectActionPerformed

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        var fmAddTP = new AddTradePoint2Franchazi();
        fmAddTP.setFranchazi(model.params.franchazi_id);
        fmAddTP.showModal(function() {
            model.listTradePoints.requery();
        });
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.listTradePoints.cursor.tp_active = !model.listTradePoints.cursor.tp_active;
    }//GEN-LAST:event_btnDelActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var tpSettings = new TradePoint();
        tpSettings.setFranchazi(model.params.franchazi_id);
        tpSettings.setTradePoint(model.listTradePoints.cursor.org_trade_point_id);
        tpSettings.showModal();
    }//GEN-LAST:event_buttonActionPerformed
}