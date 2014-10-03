/**
 * 
 * @author Alexey
 */
function TradePointsDashboard() {
    var self = this, model = this.model, form = this;
    self.tradePoints = {};
    var show = false;
    
    self.setFranchazi = function(aFranchaziId){
        Logger.info("FranchaziID = " + aFranchaziId);
        model.params.franchazi_id = aFranchaziId;
        model.listTradePoints.params.franchazi_id = aFranchaziId;
        model.listTradePoints.requery(function(){
            Logger.info("TradePoints count = " + model.listTradePoints.length);
            generateDashboardInfo();
        });
    };
    
    self.manualShow = function(aContainer) {
        self.container = aContainer;
    };
    
    function generateDashboardInfo() {
        model.listTradePoints.forEach(function(aTP){
            self.tradePoints[aTP.org_trade_point_id] = new TPCommonInfo(aTP);
        });
    }
    
    var TPCommonInfo = function(aTradePointDetails) {
        this.panel = cmn.createElement("div", "panel panel-primary trade_point", self.container);
        this.unit = new TradePointCommonInfo(aTradePointDetails, this.panel);
        this.data = aTradePointDetails;
        //this.form.setTradePoint(aTradePointDetails.org_trade_point_id);
        //this.form.showOnPanel(this.commonData);
        
    };

    function listTradePointsOnRequeried(evt) {//GEN-FIRST:event_listTradePointsOnRequeried
        
    }//GEN-LAST:event_listTradePointsOnRequeried
}
