/**
 * 
 * @author minya92
 */
function FranchaziList() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var listBillAndServices = new ListBillAndServices();
    
    function qFranchaziListOnScrolled(evt) {//GEN-FIRST:event_qFranchaziListOnScrolled
        listBillAndServices.close();
        listBillAndServices.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
        listBillAndServices.showOnPanel(form.panel);
    }//GEN-LAST:event_qFranchaziListOnScrolled

    function qFranchaziListOnRequeried(evt) {//GEN-FIRST:event_qFranchaziListOnRequeried
        listBillAndServices.close();
        listBillAndServices.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
        listBillAndServices.showOnPanel(form.panel);
    }//GEN-LAST:event_qFranchaziListOnRequeried
}
