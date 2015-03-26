/**
 * 
 * @author Алексей
 * @public
 */

function TradeItemsOnTPView() {
var self = this, model = this.model, form = this; 
var fmAddItemList, fmItemSettings;
var tp;
    
self.setTradePoint = function(aTradePoint) {
    model.qTradeItemsOnTPwData.params.trade_point = tp = aTradePoint;
    model.qTradeItemsOnTPwData.execute();
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
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
}//GEN-LAST:event_formWindowClosing


    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        if (fmAddItemList) {
            fmAddItemList.setParams(tp, session.franchaziId);
            fmAddItemList.showModal();
        } else {
            require('AddItemToDashboard', function() {
                fmAddItemList = new AddItemToDashboard();
                btnAddActionPerformed(evt);
            });
        }
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        // TODO Добавьте свой код:
    }//GEN-LAST:event_btnDelActionPerformed

    function grdTradeItemsMouseClicked(evt) {//GEN-FIRST:event_grdTradeItemsMouseClicked
        if (evt.clickCount === 2) {
            fmItemSettings = new ItemSettingsAndCost();
            fmItemSettings.setTradeItem(
                model.qTradeItemsOnTPwData.cursor.item_id,
                model.qTradeItemsOnTPwData.cursor.trade_point_id,
                model.qTradeItemsOnTPwData.cursor.items_on_tp_id
            );
            fmItemSettings.showModal(function() {
                model.requery();
            });
        }
    }//GEN-LAST:event_grdTradeItemsMouseClicked
}