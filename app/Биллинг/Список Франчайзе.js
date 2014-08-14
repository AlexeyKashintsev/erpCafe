/**
 * 
 * @author minya92
 */
function FranchaziList() {
    var self = this, model = this.model, form = this;
    var addBillOperation = new AddBillOperation();
    
    function qFranchaziListOnScrolled(evt) {//GEN-FIRST:event_qFranchaziListOnScrolled
        addBillOperation.close();
        addBillOperation.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
        addBillOperation.showOnPanel(form.panel);
    }//GEN-LAST:event_qFranchaziListOnScrolled
}
