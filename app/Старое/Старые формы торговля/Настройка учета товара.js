ы/**
 * 
 * @author Work
 */
function ControlOnWarehouse() {
    var self = this, model = this.model, form = this;
    var Parent = null;
    var contentTradeItem = new ContentTradeItem();
    
    self.setTradeItem = function(anItem){
        model.params.item_id = anItem;
        contentTradeItem.setTradeItem(anItem);
    };
    
    self.setParent = function(aParent){
        Parent = aParent;
    };
    
        

    function btnSaveInWHActionPerformed(evt) {//GEN-FIRST:event_btnSaveInWHActionPerformed
        if (model.qContents.length > 0)
            model.qContents.deleteAll();
        model.qContents.push({
            trade_item  :   model.params.item_id,
            wh_item     :   model.params.item_id,
            usage_quantity  :   1
        });
        
        if (Parent){
            Parent.pnlContent.visible = false;
            Parent.pnlContent.enabled = false;
        }
    }//GEN-LAST:event_btnSaveInWHActionPerformed

    function btnComplexContentActionPerformed(evt) {//GEN-FIRST:event_btnComplexContentActionPerformed
        contentTradeItem.showModal(function(result){
            if (result) model.save();
            else {
                form.btnSaveInWH.selected = true;
                btnSaveInWHActionPerformed();
            }
        });
        if (Parent){
            Parent.pnlContent.visible = true;
            Parent.pnlContent.enabled = true;
        }
    }//GEN-LAST:event_btnComplexContentActionPerformed

    function btnNotSaveInWHActionPerformed(evt) {//GEN-FIRST:event_btnNotSaveInWHActionPerformed
        if (model.qContents.length > 0)
            model.qContents.deleteAll();
        if (Parent){
            Parent.pnlContent.visible = false;
            Parent.pnlContent.enabled = false;
        }
    }//GEN-LAST:event_btnNotSaveInWHActionPerformed

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.save();
    }//GEN-LAST:event_buttonActionPerformed
}
