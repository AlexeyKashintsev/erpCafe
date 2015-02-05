/**
 * 
 * @author Alexey
 * @module
 */ 
function TradeItemAdd(aParent, aContainer) {
    var self = this, model = this.model;
    
    function addItemShowDialog() {
//        aParent.itemSettingsAndCost.setTradeItem(this.data.item_id);
//        aParent.itemSettingsAndCost.showModal();
    }
    
    this.click = addItemShowDialog;
    wf.TradeItemAdd.bind(this)(aContainer);
}
