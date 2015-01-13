/**
 * 
 * @author Work
 */
function addItemToDashboard() {
    var self = this, model = this.model, form = this;
    var Settings = new ItemSettingsAndCost();
    var itemCard = new ItemCard();

    function modelGridMouseClicked(evt) {//GEN-FIRST:event_modelGridMouseClicked
        model.qTradeItems.params.item_type = model.qTradeItemTypes.cursor.trade_item_type_id;
        model.qTradeItems.requery();
    }//GEN-LAST:event_modelGridMouseClicked

    function qTradeItemTypesOnChanged(evt) {//GEN-FIRST:event_qTradeItemTypesOnChanged
        model.qTradeItems.requery();
    }//GEN-LAST:event_qTradeItemTypesOnChanged

    function qTradeItemTypesOnScrolled(evt) {//GEN-FIRST:event_qTradeItemTypesOnScrolled
      
    }//GEN-LAST:event_qTradeItemTypesOnScrolled

    function modelGrid1MouseClicked(evt) {//GEN-FIRST:event_modelGrid1MouseClicked
        if (evt.clickCount > 1){
            Settings.setTradeItem(model.qTradeItems.cursor.wh_items_id);
            Settings.showModal();
        }
    }//GEN-LAST:event_modelGrid1MouseClicked

    function btnAddToDashboardActionPerformed(evt) {//GEN-FIRST:event_btnAddToDashboardActionPerformed
        //Settings.setTradeItem(model.qTradeItems.cursor.wh_items_id);
        //Settings.showModal();
    }//GEN-LAST:event_btnAddToDashboardActionPerformed

    function btnNewItemActionPerformed(evt) {//GEN-FIRST:event_btnNewItemActionPerformed
        itemCard.addNew();
        itemCard.showModal(function(result){
            if (result){
                model.qTradeItems.requery();
            }
        });
    }//GEN-LAST:event_btnNewItemActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close();
    }//GEN-LAST:event_btnCancelActionPerformed

    function paramsOnChanged(evt) {//GEN-FIRST:event_paramsOnChanged
        model.qTradeItems.requery(function(){
            if (model.qTradeItems.length === 0)
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
}
