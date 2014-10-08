/**
 * 
 * @author Alexey
 * @module
 */ 
function tradeOperaionsByTP(aTradePoint, aContainer) {
    var self = this, model = this.model;
    var shown = false;
    var content = null;
    var sessions = [];
    
    self.setWarehouse = function(aWarehouse) {
        model.qTradeSessionsInPeriod.params.trade_point = aWarehouse;
    };
    
    self.setPeriod = function(aStartDate, anEndDate) {
        Logger.info(aStartDate + " - " + anEndDate);
        if (aStartDate) model.qTradeSessionsInPeriod.params.start_date = aStartDate;
        if (anEndDate) model.qTradeSessionsInPeriod.params.end_date = anEndDate;
        $(content).remove();
        content = cmn.createElement('div', 'loadDiv', self.container);
        sessions = [];
        
        model.qTradeSessionsInPeriod.execute(function() {
            showItems();
        });
    };

    self.setTradePoint = self.setWarehouse;
    
    function SessionData(aData, aContainer) {
        var userName = cmn.createElement('th', 'whItemDesc', aContainer);
            userName.innerHTML = aData.user_name;
            var date = cmn.createElement('th', 'whItemDesc', aContainer);
            date.innerHTML = dateToString(aData.start_date);
            var startTime = cmn.createElement('th', 'whItemDesc', aContainer);
            startTime.innerHTML = cmn.getTimeString(aData.start_date);
            var endTime = cmn.createElement('th', 'whItemDesc', aContainer);
            endTime.innerHTML = cmn.getTimeString(aData.end_date);
            var startValue = cmn.createElement('th', 'whItemDesc', aContainer);
            startValue.innerHTML = aData.start_value;
            var cashValue = cmn.createElement('th', 'whItemDesc', aContainer);
            cashValue.innerHTML = aData.recieved_cash;
            var bonusesValue = cmn.createElement('th', 'whItemDesc', aContainer);
            bonusesValue.innerHTML = aData.recieved_bonuses;
            var cardValue = cmn.createElement('th', 'whItemDesc', aContainer);
            cardValue.innerHTML = aData.recieved_by_card;
            var incomeValue = cmn.createElement('th', 'whItemDesc', aContainer);
            incomeValue.innerHTML = aData.recieved_cash + aData.recieved_by_card;
            var endValue = cmn.createElement('th', 'whItemDesc', aContainer);
            endValue.innerHTML = aData.end_value;
    }
    
    function showItems() {
        $(content).remove();
        content = cmn.createElement("table", "table table-hover whSessionBalance", self.container);
            //*** #HEADER# ***
            var thead = cmn.createElement('thead', null, content, 'wh_item_title');
            var tr = cmn.createElement('tr', null, thead);
            var userName = cmn.createElement('th', 'whItemDesc', tr);
            userName.innerHTML = "Бариста";
            var date = cmn.createElement('th', 'whItemDesc', tr);
            date.innerHTML = "Дата";
            var startTime = cmn.createElement('th', 'whItemDesc', tr);
            startTime.innerHTML = "Открытие";
            var endTime = cmn.createElement('th', 'whItemDesc', tr);
            endTime.innerHTML = "Закрытие";
            var startValue = cmn.createElement('th', 'whItemDesc', tr);
            startValue.innerHTML = "Касса открытие";
            var cashValue = cmn.createElement('th', 'whItemDesc', tr);
            cashValue.innerHTML = "Наличка";
            var bonusesValue = cmn.createElement('th', 'whItemDesc', tr);
            bonusesValue.innerHTML = "Бонусы";
            var cardValue = cmn.createElement('th', 'whItemDesc', tr);
            cardValue.innerHTML = "Безнал";
            var incomeValue = cmn.createElement('th', 'whItemDesc', tr);
            incomeValue.innerHTML = "Доход";
            var endValue = cmn.createElement('th', 'whItemDesc', tr);
            endValue.innerHTML = "Касса закрытие";
            
            /*** #BODY# ***/
            var tbody = cmn.createElement('tbody', null, content, 'wh_item_title');
            model.qTradeSessionsInPeriod.beforeFirst();
            while (model.qTradeSessionsInPeriod.next()) {
                var tr = cmn.createElement('tr', 'whItemContainer ', tbody);
                sessions[sessions.length] = {
                    display : tr,
                    data    : new SessionData(model.qTradeSessionsInPeriod.cursor, tr)
                };
                
            }
    };
    
    function dateToString(aDate) {
        var DD = aDate.getDate();
        var MM = aDate.getMonth() + 1;
        var YYYY = aDate.getFullYear();
        return YYYY + '-' + MM + '-' + DD;
    }
    
    self.container = cmn.createElement("div", "tbBalanceDetails", aContainer);
    var controls = cmn.createElement('div', 'controls', self.container);
    var dtPContainer = cmn.createElement('div', 'input-prepend input-group', controls);
    var clnd = cmn.createElement('span','add-on input-group-addon', dtPContainer);
    cmn.createElement('i','glyphicon glyphicon-calendar fa fa-calendar', clnd);
    var dtP = cmn.createElement('input', 'form-control', dtPContainer, 'dateTimePicker');
    
    function initDatePicker(aStart, aEnd) {
        dtP.value = aStart + ' - ' + aEnd;
        $(dtP).daterangepicker(
            { 
              format: 'YYYY-MM-DD',
              startDate: aStart,
              endDate: aEnd
            },
            function(start, end, label) {
                self.setPeriod(new Date(start), new Date(end));
            }
        );
    }
    
    self.showData = function() {
        var iEnd = new Date();
        var iStart = new Date();
        iStart.setDate(iStart.getDate()-7);
        var sStart = dateToString(iStart);
        var sEnd = dateToString(iEnd);

        self.setTradePoint(aTradePoint);
        self.setPeriod(iStart, iEnd);
        
        try {
            initDatePicker(sStart, sEnd);
        } catch (e) {
            $.getScript("js/moment.min.js", function(){
                $.getScript("js/daterangepicker.js", function() {
                    initDatePicker(sStart, sEnd);
                });
            });
        }
        
    };
}
