/**
 * 
 * @author Алексей
 * @name WhMovements
 * @public
 */

function WhMovements() {

    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    self.setTradePoint = function(aTradePoint) {
        model.params.trade_point = aTradePoint;
    };
    //TODO Удалить перед использованием
    self.setTradePoint(15);

    form.btnReq.ActionPerformed = function(evt) {//GEN-FIRST:event_btnReqActionPerformed
            if (self.model.modified && confirm('Сохранить изменения?')) {
                self.model.save();
            }
            self.model.requery();
    };//GEN-LAST:event_btnReqActionPerformed

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        form.modelDate.value = new Date(2014,7);
        form.modelDate1.value = new Date();
        model.qSessionOnTradePoint.requery();
    };//GEN-LAST:event_formWindowOpened

    form.onWindowClosing = function(evt) {//GEN-FIRST:event_formWindowClosing
            if (self.model.modified && confirm('Сохранить изменения?')) {
               self.model.save();
            }
    };//GEN-LAST:event_formWindowClosing

    model.params.onChanged = function(evt) {//GEN-FIRST:event_paramsOnChanged
        model.qSessionOnTradePoint.requery();        // TODO Добавьте здесь свой код:
    };//GEN-LAST:event_paramsOnChanged
    
    self.show = function() {
        form.show();
    };
}