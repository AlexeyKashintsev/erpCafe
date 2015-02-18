/**
 * 
 * @author Work
 */
function AddItemToDashboard() {
    var self = this, model = this.model, form = this;
    var Settings = new ItemSettingsAndCost();
    var itemCard = new ItemCard();
    var tradeAdminModule = new ServerModule("TradeAdminModule");
    model.qTradeItemsWithSearch.params.franchazi_id = session.franchaziId;
    model.qTradeItemsWithSearch.params.trade_point = session.tradePoint;
    
    self.setParams = function(aTradePoint, aFranchazi) {
        model.qTradeItemsWithSearch.params.franchazi_id = aFranchazi;
        model.qTradeItemsWithSearch.params.trade_point = aTradePoint;
    };
    
    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        model.qTradeItemsWithSearch.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qTradeItemsWithSearch.requery();
    }//GEN-LAST:event_modelGridMouseClicked

    function modelGrid1MouseClicked(evt) {//GEN-FIRST:event_modelGrid1MouseClicked
        if (evt.clickCount > 1){
            Settings.setTradeItem(model.qTradeItemsWithSearch.cursor.wh_items_id);
            Settings.showModal();
        }
    }//GEN-LAST:event_modelGrid1MouseClicked

    function btnAddToDashboardActionPerformed(evt) {//GEN-FIRST:event_btnAddToDashboardActionPerformed
        Settings.setTradeItem(model.qTradeItemsWithSearch.cursor.wh_items_id);
        Settings.pnlCost.focus();
        Settings.showModal();
        
    }//GEN-LAST:event_btnAddToDashboardActionPerformed

    function btnNewItemActionPerformed(evt) {//GEN-FIRST:event_btnNewItemActionPerformed
        itemCard.addNew();
        itemCard.setOpenType("modal");
        itemCard.showModal(function(result){
            if (result){
                model.qTradeItemsWithSearch.requery();
            }
        });
    }//GEN-LAST:event_btnNewItemActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close();
    }//GEN-LAST:event_btnCancelActionPerformed

    function paramsOnChanged(evt) {//GEN-FIRST:event_paramsOnChanged
        model.qTradeItemsWithSearch.requery(function(){
            if (model.qTradeItemsWithSearch.length === 0)
                btnNewItemActionPerformed();
            form.tfSearch.focus();
            $("#x-widget-10-input").select();
        });
        
    }//GEN-LAST:event_paramsOnChanged

    function btnSearchActionPerformed(evt) {//GEN-FIRST:event_btnSearchActionPerformed
        model.requery();
    }//GEN-LAST:event_btnSearchActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.params.item_search = null;
        form.tfSearch.focus();
    }//GEN-LAST:event_buttonActionPerformed

    function qTradeItemTypesOnChanged(evt) {//GEN-FIRST:event_qTradeItemTypesOnChanged
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_qTradeItemTypesOnChanged

    function qTradeItemTypesOnScrolled(evt) {//GEN-FIRST:event_qTradeItemTypesOnScrolled
        // TODO Добавьте здесь свой код:
    }//GEN-LAST:event_qTradeItemTypesOnScrolled
}
