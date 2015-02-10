/**
 * 
 * @author Work
 */
function ItemSettings(aTradeItemId) {
    var self = this, model = this.model, form = this;
    
    var itemCard;
    require('ItemCard', function() {
        itemCard = new ItemCard();
        itemCard.showOnPanel(form.pnlCard);
    });
    var contentTradeItem;
    require('ContentTradeItem', function() {
        contentTradeItem = new ContentTradeItem(true);
        contentTradeItem.showOnPanel(form.pnlContent);
    });
    
   
    self.setTradeItem = function(anItemId){
        itemCard.setItem(anItemId);
        contentTradeItem.setTradeItem(anItemId);
    };
    
    if (aTradeItemId)
        self.setTradeItem(aTradeItemId);
    

    function btnSaveActionPerformed(evt) {//GEN-FIRST:event_btnSaveActionPerformed
        model.save();
        itemCard.save();
        contentTradeItem.save();
        form.close(true);
    }//GEN-LAST:event_btnSaveActionPerformed

    function btnDelActionPerformed(evt) {//GEN-FIRST:event_btnDelActionPerformed
        model.save();
        itemCard.save();
        contentTradeItem.save();
        form.close(true);
    }//GEN-LAST:event_btnDelActionPerformed

    function btnCancelActionPerformed(evt) {//GEN-FIRST:event_btnCancelActionPerformed
        form.close(false);
    }//GEN-LAST:event_btnCancelActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
    }//GEN-LAST:event_formWindowOpened
}
