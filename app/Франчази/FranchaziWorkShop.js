/**
 * 
 * @author Алексей
 */
function FranchaziWorkShop() {
    var self = this, model = this.model, form = this;
    
    var fmTP = new TradePoint();
    fmTP.showOnPanel(form.pnlWorkArea);
    fmTP.setFranchazi(model.params.franchazi);
    
    self.setFranchaziId = function(aFranchazi) {
        self.model.params.franchaziId = aFranchazi;
        fmTP.setFranchazi(model.params.franchazi);
    };

    function listTradePointsOnScrolled(evt) {//GEN-FIRST:event_listTradePointsOnScrolled
        fmTP.setTradePoint(model.listTradePoints.org_trade_point_id);
    }//GEN-LAST:event_listTradePointsOnScrolled

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened
}
