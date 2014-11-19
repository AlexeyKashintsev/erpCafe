/**
 * 
 * @author Work
 */
function ChooseCityForm() {
    var self = this, model = this.model, form = this;
    
    self.setFranchazi = function(aFranchaziId) {
        model.params.franchazi_id = aFranchaziId;
    };

    self.setTradePoint = function(aTradePointId) {
        model.params.trade_point_id = aTradePointId;
    };
    

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        model.save();
    }//GEN-LAST:event_buttonActionPerformed
}
