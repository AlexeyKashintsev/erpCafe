/**
 * 
 * @author Alexey
 * @module
 */ 
function WHMowementsByPeriod(aContainer) {
    var self = this, model = this.model;
    
    
    var tHeader = ["Наименование", "Приход", "Расход"];
    
    
    function createTable(aContainer, aHeader, aData, aTableClass, aHeaderClass, aBodyClass) {
        var content = cmn.createElement("table", "table table-hover " + aTableClass, aContainer);
        var thead = cmn.createElement('thead', null, content, aHeaderClass);
        var tr = cmn.createElement('tr', null, thead);
        for (var j in aHeader) {
            var th = cmn.createElement('th', 'table-title', tr);
            th.innerHTML = aHeader[j];
        }
        var tbody = cmn.createElement('tbody', null, content, aBodyClass);
        aData.forEach(function(aCursor) {
            aCursor.forEach(function(aRowData) {
                
            });
        });
    }
    
    self.setWarehouse = function(aTradePoint) {
        model.dsWHMovementsByPeriod.params.trade_point_id = aTradePoint;
    };
    self.setTradePoint = self.setWarehouse;
}
