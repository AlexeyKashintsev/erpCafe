/**
 * 
 * @author minya92
 */
function CopyMeasureFromItemType() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    // TODO : place your code here

    form.onWindowOpened = function(evt) {//GEN-FIRST:event_formWindowOpened
        model.requery();
    };//GEN-LAST:event_formWindowOpened

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.qTypes.beforeFirst();
        while(model.qTypes.next()){
            model.qItems.params.item_type = model.qTypes.cursor.wh_item_types_id;
            model.qItems.requery();
            model.qItems.beforeFirst();
            while (model.qItems.next()){
                model.qItems.cursor.item_measure = model.qTypes.cursor.measure;
            }
            model.save();
        }
    };//GEN-LAST:event_buttonActionPerformed
    
    self.show = function() {
        form.show();
    };
}
