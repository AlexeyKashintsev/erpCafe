/**
 * 
 * @name ItemDetails
 * @author Alexey
 * @public
 */
function ItemDetails(aName, aDesc, aCost, aQuantity, aId) {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    self.setQuantity = null;
    
    model.params.beginUpdate();
    model.params.itemName = aName;
    model.params.itemDesc = aDesc;
    model.params.cost = aCost;
    model.params.quantity = aQuantity > 0 ? aQuantity : 0;
    self.itemId = aId;
    model.params.endUpdate();

    function paramsOnChanged(evt) {//GEN-FIRST:event_paramsOnChanged
        model.params.quantity = model.params.quantity > 0 ? model.params.quantity : 0;
        model.params.sum = model.params.cost * model.params.quantity;
        form.lbCost.text = model.params.cost + ' р.';
        form.lbName.text = model.params.itemName;
        form.lbDef.text = model.params.itemDesc;
        form.lbSum.text = model.params.sum + ' р.';
        if (self.setQuantity)
            self.setQuantity(self.itemId, model.params.quantity);
    }//GEN-LAST:event_paramsOnChanged
    paramsOnChanged();
}
