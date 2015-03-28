/**
 * 
 * @author Алексей
 * @public
 */

function TradeItemsWCostOnTPView() {
var self = this, model = this.model, form = this; 
var fmAddItemList, fmItemSettings;
var tp;
var tradeAdmMod = Session.getModule("TradeAdminModule");
    
self.setTradePoint = function(aTradePoint) {
    model.qTradeItemsOnTPwData.params.trade_point = tp = aTradePoint;
//    model.qTradeItemsOnTPwData.params.actual_date = new Date();
    model.qTradeItemsOnTPwData.requery();
};

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
    model.qTradeItemsOnTPwData.forEach(function(cursor) {
        if (cursor.selling_cost !== cursor.selling_cost_orig)
            tradeAdmMod.setCost4TradeItemOnTradePoint(cursor.items_on_tp_id, cursor.selling_cost, 10, true);
        if(cursor.buying_cost !== cursor.buying_cost_orig)
            tradeAdmMod.setCost4TradeItemOnTradePoint(cursor.items_on_tp_id, cursor.buying_cost, 0, true);
    });
    model.qTradeItemsOnTPwData.requery();
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
        if (evt.clickCount === 3) {
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