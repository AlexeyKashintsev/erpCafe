/**
 * 
 * @author Work
 */
function ItemSettingsAndCost(aTradeItemId, aTradePointId) {
    var self = this, model = this.model, form = this;
    var tradeAdminModule = Session.get("TradeAdminModule");
    
    var itemCard;
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
    

    function rbTradeItemActionPerformed(evt) {//GEN-FIRST:event_rbTradeItemActionPerformed
//        if (model.qContents.length > 0)
//            model.qContents.deleteAll();
//        if (form){
//            form.pnlContent.visible = false;
//            form.pnlContent.enabled = false;
//        }
        tradeAdminModule.processChangesForTradeItem({
            item_id     :   model.params.item_id,
            trade_point :   session.tradePoint,
            trade_item  :   true
        });
    }//GEN-LAST:event_rbTradeItemActionPerformed

    function rbWhContentActionPerformed(evt) {//GEN-FIRST:event_rbWhContentActionPerformed
//        contentTradeItem.showModal(function(result){
//            if (result) model.save();
//            else {
//                form.btnSaveInWH.selected = true;
//                btnSaveInWHActionPerformed();
//            }
//        });
//        if (form){
//            form.pnlContent.visible = true;
//            form.pnlContent.enabled = true;
//        }
        tradeAdminModule.processChangesForTradeItem({
            item_id     :   model.params.item_id,
            trade_point :   session.tradePoint,
            wh_content  :   true
        });
    }//GEN-LAST:event_rbWhContentActionPerformed

    function rbWhItemActionPerformed(evt) {//GEN-FIRST:event_rbWhItemActionPerformed
//        if (model.qContents.length > 0)
//            model.qContents.deleteAll();
//        model.qContents.push({
//            trade_item  :   model.params.item_id,
//            wh_item     :   model.params.item_id,
//            usage_quantity  :   1
//        });
//        
//        if (form){
//            form.pnlContent.visible = false;
//            form.pnlContent.enabled = false;
//        }
        tradeAdminModule.processChangesForTradeItem({
            item_id     :   model.params.item_id,
            trade_point :   session.tradePoint,
            wh_item     :   true
        });
    }//GEN-LAST:event_rbWhItemActionPerformed

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        itemCard.save();
        contentTradeItem.save();
        itemCostForm.save();
        tradeAdminModule.processChangesForTradeItem({
            item_id     :   model.params.item_id,
            trade_point :   session.tradePoint,
            color       :   model.params.color
        });
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.save();
        itemCard.save();
        contentTradeItem.save();
        itemCostForm.save(true);
        form.close(true);
    }//GEN-LAST:event_btnDelActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);
    }//GEN-LAST:event_btnCancelActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.qTradeItemsOnTP.requery(function(){
            if(model.qTradeItemsOnTP.cursor.trade_item)
                form.rbTradeItem.selected = model.qTradeItemsOnTP.cursor.trade_item;
            if(model.qTradeItemsOnTP.cursor.wh_content)
                form.rbWhContent.selected = model.qTradeItemsOnTP.cursor.wh_content;
            if(model.qTradeItemsOnTP.cursor.wh_item)
                form.rbWhItem.selected = model.qTradeItemsOnTP.cursor.wh_item;
            if(model.qTradeItemsOnTP.cursor.color)
                model.params.color = model.qTradeItemsOnTP.cursor.color;
        });
    }//GEN-LAST:event_formWindowOpened
}
