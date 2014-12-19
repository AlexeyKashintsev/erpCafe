/**
 * 
 * @author Work
 */
function ControlOnWarehouse() {
    var self = this, model = this.model, form = this;
    
    self.setTradeItem = function(anItem){
        model.params.item_id = anItem;
    };
}
