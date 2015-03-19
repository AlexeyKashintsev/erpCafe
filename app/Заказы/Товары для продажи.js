/**
 * 
 * @author minya92
 */
function BillItems() {
    var self = this, model = this.model, form = this;
    var addBillItems = new AddBillItems();
    var billMeasures = new BillMeasures();
    var billItemsModule = new ServerModule("BillItemsModule");
    self.cost = 0; self.items = [];
    model.params.account_id = 0;
    
    self.setAccountId = function(anAccountId){
        model.params.account_id = anAccountId;
        model.requery();
    };
    
    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened

    }//GEN-LAST:event_formWindowOpened

    function btnAdd1ActionPerformed(evt) {//GEN-FIRST:event_btnAdd1ActionPerformed
        //addBillItems.setServiceId(false);
        addBillItems.showModal(function(aResult){
            if(aResult) model.requery();
        });
        
    }//GEN-LAST:event_btnAdd1ActionPerformed

    function btnDel1ActionPerformed(evt) {//GEN-FIRST:event_btnDel1ActionPerformed
        if(confirm("Удалить товар?")){
            billItemsModule.delItem(model.qItemBillCost.cursor.items_catalog_id);
            model.qItemBillCost.requery();
        }
    }//GEN-LAST:event_btnDel1ActionPerformed

    function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    if (self.model.modified&&confirm('Сохранить изменения?')){
        self.model.save();
    }
    self.model.requery();
    }//GEN-LAST:event_btnReqActionPerformed

    function btnReq1ActionPerformed(evt) {//GEN-FIRST:event_btnReq1ActionPerformed
        billMeasures.showModal(function(a){
            if(a) model.requery();
        });
    }//GEN-LAST:event_btnReq1ActionPerformed
}
