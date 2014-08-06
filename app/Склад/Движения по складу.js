/**
 * 
 * @author Алексей
 * @name WhMovements
 * @public
 */

function WhMovements() {

    var self = this, model = this.model, form = this;
    
    
    
    
    
    
    self.setTradePoint = function(aTradePoint) {
        model.params.trade_point = aTradePoint;
    };
    
    self.setTradePoint(15);

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
        if (self.model.modified && confirm('Сохранить изменения?')) {
            self.model.save();
        }
        self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
}//GEN-LAST:event_btnSaveActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    form.modelDate.value = new Date(2014,7);
    form.modelDate1.value = new Date();
    model.qSessionOnTradePoint.requery();
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
        if (self.model.modified && confirm('Сохранить изменения?')) {
           self.model.save();
        }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed

    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed

    }//GEN-LAST:event_btnDelActionPerformed

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked

    }//GEN-LAST:event_modelGridMouseClicked

    function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
    }//GEN-LAST:event_btnSelectActionPerformed

    function paramsOnChanged(evt) {//GEN-FIRST:event_paramsOnChanged
        model.qSessionOnTradePoint.requery();        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_paramsOnChanged
}