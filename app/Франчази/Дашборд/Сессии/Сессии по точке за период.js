/**
 * 
 * @author Alexey
 */ 
function tradeOperaionsByTP(aTradePoint, aContainer) {
    var self = this, model = this.model;
    var shown = false;
    var content = null;
    var sessionDetailsView = null;
    
    var set = settings.getSettings(null, null, null, session.getFranchize());
    var baristaName = set.barista_name.name ? set.barista_name.name : "Бариста";
    
    var tHeader = [baristaName, "Дата", "Открытие", "Закрытие", "Касса открытие",
                   "Наличка", "Бонусы", "Безнал", "Доход", "Касса закрытие"];
    
    self.setWarehouse = function(aWarehouse) {
        model.qTradeSessionsInPeriod.params.trade_point = aWarehouse;
    };
    
    self.setPeriod = function(aStartDate, anEndDate) {
        Logger.info(aStartDate + " - " + anEndDate);
        if (aStartDate) model.qTradeSessionsInPeriod.params.start_date = aStartDate;
        if (anEndDate) model.qTradeSessionsInPeriod.params.end_date = anEndDate;
        grid.prepare();
        
        model.qTradeSessionsInPeriod.execute(function() {
            model.qTradeSessionsInPeriod.beforeFirst();
            var sessions = [];
            while (model.qTradeSessionsInPeriod.next()) {
                sessions.push(SessionData(model.qTradeSessionsInPeriod.cursor));
            }
            grid.setData(sessions);
        });
    };

    self.setTradePoint = self.setWarehouse;
    
    function SessionData(aData) {
        var dataRow = [aData.user_name, dtPicker.dateToString(aData.start_date),
            cmn.getTimeString(aData.start_date), cmn.getTimeString(aData.end_date)]
            if (!aData.revision) {
                dataRow.push(aData.start_value);
                dataRow.push(aData.recieved_cash);
                dataRow.push(aData.recieved_bonuses);
                dataRow.push(aData.recieved_by_card);
                dataRow.push(aData.recieved_cash + aData.recieved_by_card);
                dataRow.push(aData.end_value);
                dataRow.onclick = function() {
                    showSessionDetails(aData);
                };
            } else {
                dataRow.push('Ревизия склада');
            }
        return dataRow;
    }
    
    self.container = cmn.createElement("div", "tbBalanceDetails", aContainer);
    var controls = cmn.createElement('div', 'controls', self.container);
    var dtPicker = new wf.DateTimePeriodPicker(controls, self.setPeriod);
    var content = cmn.createElement('div', 'content', self.container);
    var grid = new wf.Table(content, tHeader);
    
    self.showData = function() {
        self.setTradePoint(aTradePoint);
        dtPicker.init();
    };
    
    
    function showSessionDetails(aData) {
        if (!sessionDetailsView)
            sessionDetailsView = new mSessionData();
        sessionDetailsView.parent = self;
        sessionDetailsView.show(aData);
    }
}
