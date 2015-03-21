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
        model.qTradeTypesByItemId.requery(function() {
            if (model.qTradeTypesByItemId.empty) {
                model.qGetItem.params.item_id = anItemID;
                model.qGetItem.requery(function() {
                    if (!model.qGetItem.empty)
                        model.qTradeTypesByItemId.push({
                            trade_item: anItemID,
                            type_id:    model.qGetItem.cursor.item_type
                        });
                });
            }
        });
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
