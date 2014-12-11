/**
 * 
 * @author Alexey
 * @module
 */ 
function WHMowementsByPeriod(aWarehouse, aContainer) {
    var self = this, model = this.model;
    var content = null;
    var shown = false;
    
    self.setWarehouse = function(aTradePoint) {
        model.dsWHMovementsByPeriod.params.trade_point_id = aTradePoint;
    };
    self.setTradePoint = self.setWarehouse;
    
    self.setPeriod = function(aStartDate, anEndDate) {
        Logger.info(aStartDate + " - " + anEndDate);
        if (aStartDate) model.dsWHMovementsByPeriod.params.start_date = aStartDate;
        if (anEndDate) model.dsWHMovementsByPeriod.params.end_date = anEndDate;
        
        sessions = [];
        
        grid.prepare();
        model.dsWHMovementsByPeriod.execute(function() {
            grid.setData(model.dsWHMovementsByPeriod);
        });
    };
    
    var tHeader = ["Наименование", "Приход", "Расход"];    
    
    self.container = cmn.createElement("div", "tbBalanceDetails", aContainer);
    var controls = cmn.createElement('div', 'controls', self.container);
    var dtPicker = new wf.DateTimePeriodPicker(controls, self.setPeriod);
    var content = cmn.createElement('div', 'content', self.container);
    var grid = new wf.Table(content, tHeader);
    
    self.showData = function() {
        self.setTradePoint(aWarehouse);
        dtPicker.init();
    };
}
