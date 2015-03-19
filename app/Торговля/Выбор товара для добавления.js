/**
 * 
 * @author Work
 */
function AddItemToDashboard() {
    var self = this, model = this.model, form = this;
    var ItemSettings = new ItemSettingsAndCost();
    var itemCard = new ItemCard();
    var tradeAdminModule = new ServerModule("TradeAdminModule");
    
    self.setParams = function(aTradePoint, aFranchazi) {
        /*model.qTradeItemsWithSearch.params.franchazi_id = 
                model.itemType.params.franchazi_id = aFranchazi;
        model.qTradeItemsWithSearch.params.trade_point = aTradePoint;*/
        model.params.beginUpdate();
        model.params.franchazi_id = aFranchazi;
        model.params.trade_point_id = aTradePoint;
        model.params.endUpdate();
    };
    
    self.setParams(session.tradePoint, session.franchaziId);
    
    function mgCatalogMouseClicked(evt) {//GEN-FIRST:event_mgCatalogMouseClicked
        if (evt.clickCount > 1){
            showItemSettings();
        }
    }//GEN-LAST:event_mgCatalogMouseClicked

    function btnAddToDashboardActionPerformed(evt) {//GEN-FIRST:event_btnAddToDashboardActionPerformed
        showItemSettings();
        
    }//GEN-LAST:event_btnAddToDashboardActionPerformed

    function showItemSettings() {
        ItemSettings.setTradeItem(model.qTradeItemsWithSearch.cursor.items_catalog_id);
        ItemSettings.showModal();
    }

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
        if (evt.propertyName == "item_search")
            model.qTradeItemsWithSearch.requery(function(){
                if (model.qTradeItemsWithSearch.length === 0)
                    btnNewItemActionPerformed();
                form.tfSearch.focus();
                //$("#x-widget-10-input").select();
            });
        
    }//GEN-LAST:event_paramsOnChanged

    function btnSearchActionPerformed(evt) {//GEN-FIRST:event_btnSearchActionPerformed
        model.requery();
    }//GEN-LAST:event_btnSearchActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.params.item_search = null;
        form.tfSearch.focus();
    }//GEN-LAST:event_buttonActionPerformed
}
