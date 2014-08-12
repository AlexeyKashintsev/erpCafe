/**
 * 
 * @author minya92
 */
function FranchaziList() {
    var self = this, model = this.model, form = this;
    var addBillOperation = new AddBillOperation();

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        addBillOperation.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
        addBillOperation.showModal(function(){});
        
    }//GEN-LAST:event_buttonActionPerformed
}
