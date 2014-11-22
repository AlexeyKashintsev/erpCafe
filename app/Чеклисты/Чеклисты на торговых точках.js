/**
 * 
 * @author minya92
 */
function CheklistOnTradePoint() {
    var self = this, model = this.model, form = this;
    model.params.franchazi_id = null;
    model.params.cheklist_id = null;
    
    self.setFranchazi = function(aFId){
        model.params.franchazi_id = aFId;
    };
    
    self.setChecklist = function(aCLId){
        model.params.cheklist_id = aCLId;
    };


    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        var changed, hidden;
        model.qCheklistUsage.beforeFirst();
        while(model.qCheklistUsage.next()){
            changed = Boolean(model.qCheklistUsage.cursor.selected);
            hidden  = Boolean(model.qCheklistUsage.cursor.selected_hidden);
            if(changed !== hidden){
                if(changed){
                    model.qCheklistUsage.insert(
                        model.qCheklistUsage.schema.cheklist_id, model.params.cheklist_id,
                        model.qCheklistUsage.schema.trade_point_id, model.qCheklistUsage.cursor.org_trade_point_id
                    );
                } else {
                    model.qCheklistUsage.deleteRow();
                }
            }
        }
        model.save();
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        model.requery();
    }//GEN-LAST:event_formWindowOpened
}
