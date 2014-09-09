/**
 * 
 * @author Алексей
 */
function FranchaziWorkShop() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    
    var fmTP = new TradePoint();
    fmTP.showOnPanel(form.pnlWorkArea);
    fmTP.setFranchazi(model.params.franchazi);
    
    self.setFranchazi = function(aFranchazi) {
        self.model.params.franchazi = aFranchazi;
        fmTP.setFranchazi(model.params.franchazi);
        model.listTradePoints.requery();
    };
    
    try {
        units.userSession.getFranchazi(function(aFranchazi){
            self.setFranchazi(aFranchazi);
        });
    } catch (e) {
        Logger.info('Not under browser');
    }

    model.listTradePoints.onScrolled = function(evt) {//GEN-FIRST:event_listTradePointsOnScrolled
        fmTP.setTradePoint(model.listTradePoints.org_trade_point_id);
    };//GEN-LAST:event_listTradePointsOnScrolled

    model.listTradePoints.onRequeried = function(evt) {//GEN-FIRST:event_listTradePointsOnRequeried
        fmTP.setTradePoint(model.listTradePoints.org_trade_point_id);
    };//GEN-LAST:event_listTradePointsOnRequeried
    
    self.show = function() {
        form.show();
    };
}
