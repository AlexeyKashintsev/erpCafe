/**
 * 
 * @author Alexey
 */
function TradeTypesByItemForm() {
    var self = this, model = this.model, form = this;
    var fmTypes = new ChangeItemType();
    var curItem;
    model.itemType.params.franchazi_id = session.getFranchazi();
    model.itemType.requery();
    
    self.setTradeItem = function(anItemID) {
        curItem = model.qTradeTypesByItemId.params.item_id = anItemID;
        model.qTradeTypesByItemId.requery();
    };
    
    self.save = function() {
        model.save();
    }

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        fmTypes.isSelectTradeType = true;
        fmTypes.showModal(function(aTypeId) {
            model.itemType.requery();
            if (aTypeId)
                model.qTradeTypesByItemId.push({
                    trade_item  :   curItem,
                    type_id     :   aTypeId
                });
        });
    }//GEN-LAST:event_btnAddActionPerformed

    function btnDeleteActionPerformed(evt) {//GEN-FIRST:event_btnDeleteActionPerformed
        model.qTradeTypesByItemId.deleteRow();
    }//GEN-LAST:event_btnDeleteActionPerformed
}
