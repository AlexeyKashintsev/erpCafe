/**
 * 
 * @author minya92
 */
function FranchaziList() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    var listBillAndServices = new ListBillAndServices();
    
    model.qFranchaziList.onRequeried = function(event) {
        //listBillAndServices. close();
        //form.panel.
        listBillAndServices.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
        //listBillAndServices.// showOnPanel(form.panel);
    };
    
    model.qFranchaziList.onScrolled = function(event) {
        //listBillAndServices.close();
        listBillAndServices.setFranchaziId(model.qFranchaziList.cursor.org_franchazi_id);
       // listBillAndServices.showOnPanel(form.panel);
    };
    
    self.show = function() {
        form.show();
    };
    
    form.onWindowOpened = function(event) {
        model.qFranchaziList.requery();
        // TODO Добавьте здесь свой код
    };

}
