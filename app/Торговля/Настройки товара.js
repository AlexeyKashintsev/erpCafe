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
        checkColor(model.qTradeItemsOnTP.cursor.color);
        //bonusPanel.setTradeItem(anItem);
    };
    
    if (aTradeItemId)
        self.setTradeItem(aTradeItemId);

    function checkColor(aColor){
        switch (aColor){
            case "blue" : form.rbtBlue.selected = true; break;
            case "black" : form.rbtBlack.selected = true; break;
            case "green" : form.rbtGreen.selected = true; break;
            case "violet" : form.rbtViolet.selected = true; break;
            case "red" : form.rbtRed.selected = true; break;
            default : form.rbtStandart.selected = true; break;    
        }
    }
    
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

    function rbtStandartActionPerformed(evt) {//GEN-FIRST:event_rbtStandartActionPerformed
        model.qTradeItemsOnTP.cursor.color = "";
    }//GEN-LAST:event_rbtStandartActionPerformed

    function rbtBlueActionPerformed(evt) {//GEN-FIRST:event_rbtBlueActionPerformed
        model.qTradeItemsOnTP.cursor.color = "blue";
    }//GEN-LAST:event_rbtBlueActionPerformed

    function rbtGreenActionPerformed(evt) {//GEN-FIRST:event_rbtGreenActionPerformed
        model.qTradeItemsOnTP.cursor.color = "green";
    }//GEN-LAST:event_rbtGreenActionPerformed

    function rbtRedActionPerformed(evt) {//GEN-FIRST:event_rbtRedActionPerformed
        model.qTradeItemsOnTP.cursor.color = "red";
    }//GEN-LAST:event_rbtRedActionPerformed

    function rbtBlackActionPerformed(evt) {//GEN-FIRST:event_rbtBlackActionPerformed
        model.qTradeItemsOnTP.cursor.color = "black";
    }//GEN-LAST:event_rbtBlackActionPerformed

    function rbtVioletActionPerformed(evt) {//GEN-FIRST:event_rbtVioletActionPerformed
        model.qTradeItemsOnTP.cursor.color = "violet";
    }//GEN-LAST:event_rbtVioletActionPerformed
}
