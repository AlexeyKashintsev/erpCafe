/**
 * 
 * @author Work
 */
function ControlOnWarehouse() {
    var self = this, model = this.model, form = this;
    
    var contentTradeItem = new ContentTradeItem();
    
    self.setTradeItem = function(anItem){
        model.params.item_id = anItem;
        contentTradeItem.setTradeItem(anItem);
    };
    
    

    function btnSaveInWHActionPerformed(evt) {//GEN-FIRST:event_btnSaveInWHActionPerformed
        model.qTradeItemContents.deleteAll();
        model.qTradeItemContents.push({
            trade_item  :   model.params.item_id,
            wh_item     :   model.params.item_id,
            usage_quantity  :   1
        });
    }//GEN-LAST:event_btnSaveInWHActionPerformed

    function btnComplexContentActionPerformed(evt) {//GEN-FIRST:event_btnComplexContentActionPerformed
        contentTradeItem.showModal(function(result){
            if (result) model.save();
            else {
                form.btnSaveInWH.selected = true;
                btnSaveInWHActionPerformed();
            }
        });
    }//GEN-LAST:event_btnComplexContentActionPerformed

    function btnNotSaveInWHActionPerformed(evt) {//GEN-FIRST:event_btnNotSaveInWHActionPerformed
        model.qTradeItemContents.deleteAll();
    }//GEN-LAST:event_btnNotSaveInWHActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.save();
    }//GEN-LAST:event_buttonActionPerformed
}
