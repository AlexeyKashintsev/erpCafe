/**
 * 
 * @author Work
 */
function ItemSettingsAndCost(aTradeItemId) {
    var self = this, model = this.model, form = this;
    
    var itemCard = new ItemCard();
    require('ItemCard', function() {
        itemCard = new ItemCard();
        itemCard.showOnPanel(form.pnlCard);
    });
    var contentTradeItem;
    require('ContentTradeItem', function() {
        contentTradeItem = new ContentTradeItem();
        contentTradeItem.showOnPanel(form.pnlContent);
    });
    
    var itemCostForm;
    require('ContentTradeItem', function() {
        itemCostForm = new ItemCostForm();
        itemCostForm.showOnPanel(form.pnlCost);
    });
    //var bonusPanel = new BonusRateForm();
    
    
    
    //bonusPanel.showOnPanel(form.pnlBonus);

    
    self.setTradeItem = function(anItemId){
        itemCard.setItem(anItemId);
        contentTradeItem.setTradeItem(anItemId);
        itemCostForm.setItem(anItemId);
        model.qTradeItemsOnTP.params.trade_point = session.tradePoint;
        model.params.item_id = anItemId;
        //bonusPanel.setTradeItem(anItem);
    };
    
    if (aTradeItemId)
        self.setTradeItem(aTradeItemId);
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    }//GEN-LAST:event_formWindowOpened


    function btnNotSaveInWHActionPerformed(evt) {//GEN-FIRST:event_btnNotSaveInWHActionPerformed
        if (model.qContents.length > 0)
            model.qContents.deleteAll();
        if (form){
            form.pnlContent.visible = false;
            form.pnlContent.enabled = false;
        }
    }//GEN-LAST:event_btnNotSaveInWHActionPerformed

    function btnComplexContentActionPerformed(evt) {//GEN-FIRST:event_btnComplexContentActionPerformed
        contentTradeItem.showModal(function(result){
            if (result) model.save();
            else {
                form.btnSaveInWH.selected = true;
                btnSaveInWHActionPerformed();
            }
        });
        if (form){
            form.pnlContent.visible = true;
            form.pnlContent.enabled = true;
        }
    }//GEN-LAST:event_btnComplexContentActionPerformed

    function btnSaveInWHActionPerformed(evt) {//GEN-FIRST:event_btnSaveInWHActionPerformed
        if (model.qContents.length > 0)
            model.qContents.deleteAll();
        model.qContents.push({
            trade_item  :   model.params.item_id,
            wh_item     :   model.params.item_id,
            usage_quantity  :   1
        });
        
        if (form){
            form.pnlContent.visible = false;
            form.pnlContent.enabled = false;
        }
    }//GEN-LAST:event_btnSaveInWHActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        itemCard.save();
        contentTradeItem.save();
        itemCostForm.save();
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.save();
        itemCard.save();
        contentTradeItem.save();
        itemCostForm.save(true);
        form.close();
    }//GEN-LAST:event_btnDelActionPerformed
}
