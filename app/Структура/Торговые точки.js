/**
 * 
 * @author Алексей
 * @name TradePointsForm
 * @public
 */

function TradePointsForm() {
var self = this, model = this.model, form = this;

var isSelectForm = false;
var isEditable = false;
var canSetEdit = true;

//var usersFrachaziOrTP = new UsersFrachaziOrTP();

model.params.franchazi_id = null;

self.setFranchaziId = function(aFranchaziId){
    model.params.franchazi_id = aFranchaziId;
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
}