/**
 * 
 * @author minya92
 */
function FranchaziList() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var listBillAndServices = new ListBillAndServices();
    
    model.qFranchaziList.onScrolled = function(evt) {//GEN-FIRST:event_qFranchaziListOnScrolled
        listBillAndServices.close();
        listBillAndServices.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
        listBillAndServices.showOnPanel(form.panel);
    }//GEN-LAST:event_qFranchaziListOnScrolled

    model.qFranchaziList.onRequeried = function(evt) {//GEN-FIRST:event_qFranchaziListOnRequeried
        listBillAndServices.close();
        listBillAndServices.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
        listBillAndServices.showOnPanel(form.panel);
    }//GEN-LAST:event_qFranchaziListOnRequeried
    
    self.show = function() {
        form.show();
    };
}
