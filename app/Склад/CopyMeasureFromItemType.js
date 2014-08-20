/**
 * 
 * @author minya92
 */
function CopyMeasureFromItemType() {
    var self = this, model = this.model, form = this;
    
    // TODO : place your code here

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.requery();
    }//GEN-LAST:event_formWindowOpened

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
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
    }//GEN-LAST:event_buttonActionPerformed
}
