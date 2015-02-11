/**
 * 
 * @author Алексей
 */
function FranchaziWorkShop() {
    var self = this, model = this.model, form = this;
    
    var fmTP = new TradePoint();
    fmTP.showOnPanel(form.pnlWorkArea);
    //fmTP.setFranchazi(model.params.franchazi);*/
    
    self.setFranchazi = function(aFranchazi) {
        self.model.params.franchazi = aFranchazi;
        fmTP.setFranchazi(model.params.franchazi);
        model.listTradePoints.requery();
    };
    
    try {
        session.getFranchazi(function(aFranchazi){
            self.setFranchazi(aFranchazi);
        });
    } catch (e) {
        Logger.info('Not under browser');
    }

    function listTradePointsOnScrolled(evt) {//GEN-FIRST:event_listTradePointsOnScrolled
        fmTP.setTradePoint(model.listTradePoints.org_trade_point_id);
    }//GEN-LAST:event_listTradePointsOnScrolled

    function listTradePointsOnRequeried(evt) {//GEN-FIRST:event_listTradePointsOnRequeried
        fmTP.setTradePoint(model.listTradePoints.org_trade_point_id);
    }//GEN-LAST:event_listTradePointsOnRequeried
}
