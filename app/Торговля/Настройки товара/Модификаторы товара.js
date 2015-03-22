/**
 * 
 * @author Алексей
 * @name template
 * @public
 */

function TradeItemsModifiers(aFranchazi, anItemOnTp) {
    var self = this, model = this.model, form = this; 

    model.qItemsModifiersTypes.params.franchazi_id = 
            model.qModValues.params.franchazi_id = aFranchazi ? aFranchazi : session.franchaziId;
    model.qItemsModifiersTypes.requery();

    var fmItemsModifiers = new TradeItemsModifiersValues(aFranchazi);

    self.setItem = function(anItemOnTp) {
        model.qItemsOnTpModifiers.params.item_on_tp = anItemOnTp;
        model.qItemsOnTpModifiers.requery();
    };
        
    self.getModString = function() {
        var short_string = '';
        model.qItemsOnTpModifiers.forEach(function(cursor) {
            if (cursor.show) {
                var shStr = model.qModValues.findById(cursor.mod_value);
                shStr = shStr.display_value ? shStr.display_value : shStr.mod_value;
                short_string += (short_string ? ' ' : '') + shStr;
            }
        });
        return short_string;
    };
    
    self.getModifiers = function() {
        var res = {};
        model.qItemsOnTpModifiers.forEach(function(cursor) {
            res[cursor.mod_value] = {
                show:   cursor.show,
                modifier:   cursor.modifier
            };
        });
        return res;
    };

function btnReqActionPerformed(evt) {//GEN-FIRST:event_btnReqActionPerformed
    model.requery();
}//GEN-LAST:event_btnReqActionPerformed

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
}//GEN-LAST:event_formWindowOpened

function formWindowClosing(evt) {//GEN-FIRST:event_formWindowClosing
    if (model.modified&&confirm('Сохранить изменения?')){
        model.save();
    }
}//GEN-LAST:event_formWindowClosing

    function btnAddActionPerformed(evt) {//GEN-FIRST:event_btnAddActionPerformed
        fmItemsModifiers.showModal(function(aModifier){
            var item_on_tp = model.qItemsOnTpModifiers.params.item_on_tp;
            model.qModValues.requery();
            model.qItemsOnTpModifiers.push({
                item_on_tp: item_on_tp,
                mod_value:  aModifier[0],
                modifier:   aModifier[1],
                show:       true
            });
        });
    }//GEN-LAST:event_btnAddActionPerformed
}