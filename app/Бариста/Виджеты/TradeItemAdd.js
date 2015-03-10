/**
 * 
 * @author Alexey
 * @module
 */ 
function TradeItemAdd(aParent, aContainer) {
    var self = this, model = this.model;
    var addItemToDashboard;
    require('AddItemToDashboard', function() {
        addItemToDashboard = new AddItemToDashboard();
    });
    
    function addItemShowDialog() {
        addItemToDashboard.showModal(aParent.reloadItems);
    }
    
    this.click = addItemShowDialog;
    wf.TradeItemAdd.bind(this)(aContainer);
}
