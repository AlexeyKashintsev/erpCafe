/**
 * 
 * @author minya92
 */
function FranchaziList() {
    var self = this, model = this.model, form = this;
    var addBillOperation = new AddBillOperation();
    
    addBillOperation.showOnPanel(form.panel);
    
    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
    
    }//GEN-LAST:event_buttonActionPerformed

    function qFranchaziListOnScrolled(evt) {//GEN-FIRST:event_qFranchaziListOnScrolled
        addBillOperation.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
        
    }//GEN-LAST:event_qFranchaziListOnScrolled
}
