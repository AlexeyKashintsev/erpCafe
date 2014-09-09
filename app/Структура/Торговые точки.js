/**
 * 
 * @author Алексей
 * @name TradePoints
 * @public
 */

function TradePoints() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

    var isSelectForm = false;
    self.addButtons = false;

    model.params.franchazi_id = null;

    self.setFranchazi = function(aFranchaziId){
        model.params.franchazi_id = aFranchaziId;
        model.listTradePoints.requery();
    };
    
    form.btnReq.onActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
        self.model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.btnSave.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        self.model.save();
    };//GEN-LAST:event_btnSaveActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        if (!isSelectForm){
            self.pnlSelLock.visible = false;
            form.btnAdd.visible = form.btnDel.visible = self.addButtons;
        }
    };//GEN-LAST:event_formWindowOpened

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified&&confirm('Сохранить изменения?')){
            self.model.save();
        }
    };//GEN-LAST:event_formWindowClosing

    form.btnSelect.onActionPerformed = function(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        close(model.listTradePoints.org_trade_point_id);
    };//GEN-LAST:event_btnSelectActionPerformed
    
    self.show = function() {
        form.show();
    };
}