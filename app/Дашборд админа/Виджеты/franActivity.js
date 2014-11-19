/**
 * 
 * @author Alexey
 * @module
 */ 
function franActivity(aFranchaziID, aContainer) {
    var self = this, model = this.model;
    var rqCount = 0;
    var tpView = []
    
    var body = cmn.createElement("div", 'fran_info', aContainer);
    model.params.franchaziId = aFranchaziID;
    model.listFranchazi.requery();
    model.listTradePoints.requery();
    
    function show() {
        var fName = cmn.createElement("h1", "franchazi_name", body);
        fName.innerHTML = model.listFranchazi.cursor.f_name;
        var tpCount = cmn.createElement("p", "tp_count", body);
        tpCount.innerHTML = 'Всего точек: ' + model.listTradePoints.length;
        
        var tpRow = cmn.createElement("div", "row", body);
        
        model.listTradePoints.beforeFirst();
        while (model.listTradePoints.next()) {
            var tp = model.listTradePoints.cursor.org_trade_point_id;
            //tpView[tp] = {};
            //tpView[tp].container = cmn.createElement("div", "tp_data", c);
            tpView[tp] = new TPActivity(tp, tpRow);
        }
    }

    function listTradePointsOnRequeried(evt) {//GEN-FIRST:event_listTradePointsOnRequeried
        rqCount++;
        if (rqCount === 2) show();
    }//GEN-LAST:event_listTradePointsOnRequeried

    function listFranchaziOnRequeried(evt) {//GEN-FIRST:event_listFranchaziOnRequeried
        rqCount++;
        if (rqCount === 2) show();
    }//GEN-LAST:event_listFranchaziOnRequeried
}
