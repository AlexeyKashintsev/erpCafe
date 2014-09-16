/**
 * 
 * @author Alexey
 * @module
 */
function TradePointCommonInfo(aTradePointDetails, aContainer) {
    var self = this, model = this.model;
    var container = aContainer;
    var chart = null;
    var tradePointDetails = aTradePointDetails;

    self.setContainer = function(aContainer) {
        container = aContainer;
    };

    self.setDetails = function() {
        tradePointDetails = aTradePointDetails;
    };

    self.setFranchazi = function(aFranchazi) {

    };

    self.setTradePoint = function(aTradePoint) {
        model.params.tradePointID = aTradePoint;
    };

    var periods = {
        day: {
            days    : 1,
            interval: 1,
            g_value : "YY/MM/DD/HH24",
            d_format: "HH24:00"
        },
        week: {
            days: 7,
            interval: 1, //Измеряется в часах
            g_value: "YY/MM/DD/HH24",
            d_format: "HH24:00"
        },
        month: {
            days: 30,
            interval: 24,
            g_value: "YY/MM/DD",
            d_format: "HH24:00"
        },
        quarter: {
            days: 90,
            interval: 24 * 7,
            g_value: "YY/MM/DD",
            d_format: "HH24:00"
        },
        year: {
            days: 360,
            interval: 24 * 30,
            g_value: "YY/MM",
            d_format: "HH24:00"
        }
    };
    
    /*function getDateString(aMask, aDate) {
        function normalize(aValue) {
            aValue = '' + aValue;
            if (aValue.length === 1) aValue = "0" + aValue;
            if (aValue.length > 2) aValue = aValue.substr(aValue.length - 2, 2);
            return aValue;
        }
        
        var dateObj = {
            YY  :   normalize(aDate.getFullYear()),
            MM  :   normalize(aDate.getMonth()+1),
            DD  :   normalize(aDate.getDate()),
            HH24:   normalize(aDate.getHours())
        };

        aMask = 'dateObj.' + aMask.replace(/\//g, ' + "/" + dateObj.');
        aMask = eval(aMask);
        return aMask;
    }*/

    function generateData4Chart(aPeriod) {
        var timeAxis = [];
        var cDate = new Date(aPeriod.startDate);
        var chartData = [];
        for (var j = 0; j < aPeriod.days * 24 / aPeriod.interval; j++) {
            timeAxis.push(new Date(cDate));
            var endDate = new Date(cDate);
            endDate.setHours(endDate.getHours() + aPeriod.interval);
            var value = 0;
            model.qTradePointIncomeByPeriod.beforeFirst();
            while (model.qTradePointIncomeByPeriod.next()) {
                if (model.qTradePointIncomeByPeriod.cursor.d_value <= endDate &&
                        model.qTradePointIncomeByPeriod.cursor.d_value > cDate)
                    value += model.qTradePointIncomeByPeriod.cursor.sm;
            }
            chartData.push(value ? value : null);
            cDate.setHours(cDate.getHours() + aPeriod.interval);
        }
        
        Logger.info(chartData);
        Logger.info(timeAxis);
        return chartData;
    }

    function addChart(aContainer, aPeriod) {
        var chartData = generateData4Chart(aPeriod);
        chart = new Highcharts.Chart({
            chart: {
                renderTo: aContainer,
                type: 'column'
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                    data: chartData,
                    pointStart: Date.UTC(aPeriod.startDate.getFullYear()
                        , aPeriod.startDate.getMonth()
                        , aPeriod.startDate.getDate()
                        , aPeriod.startDate.getHours()),
                    pointInterval: 3600 * 1000 * aPeriod.interval
                }]
        });
        
    }


    function createChart(aPeriod, aContainer) {
        var period = periods[aPeriod];
        
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - period.days);
        if (period.g_value === "YY/MM")
            startDate.setDate(0);
        if (period.g_value === "YY/MM/DD")
            startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        
        period.startDate = startDate;
        
        model.qTradePointIncomeByPeriod.params.g_value = period.g_value;
        model.qTradePointIncomeByPeriod.params.begDate = startDate;
        model.qTradePointIncomeByPeriod.params.trade_point_id = tradePointDetails.org_trade_point_id;
        model.qTradePointIncomeByPeriod.requery(function() {
            addChart(aContainer, period);
        });
    }

    function showOnContainer() {
        var heading = cmn.createElement("div", "panel-heading", container);
        heading.innerHTML = '<h3 class="panel-title">' + tradePointDetails.tp_name + '</h3>';
        var tpAddress = cmn.createElement("span", "label label-bw", heading);
        tpAddress.innerHTML = tradePointDetails.tp_address;

        var panelContent = cmn.createElement("div", "panel-body", container);
        //var row = cmn.createElement("div", "row", panelContent);
        var currentSession = cmn.createElement("div", "col-md-3", panelContent);//row);
        try {
            currentSession.innerHTML =
                    (tradePointDetails.end_date ? '<button class="label label-default label-block">Смена закрыта</button>' :
                            '<button class="label label-success label-block">Точка работает</button>') + '<br>' +
                    '<span class="glyphicon glyphicon-user"></span>   ' + tradePointDetails.user_name + '<br>' +
                    '<span class="glyphicon glyphicon-calendar"></span>   ' + tradePointDetails.start_date.toLocaleDateString() + '<br>' +
                    '<span class="glyphicon glyphicon-time"></span>   ' + tradePointDetails.start_date.getHours() + ':' + tradePointDetails.start_date.getMinutes() + ' | ' +
                    (tradePointDetails.end_date ? tradePointDetails.end_date.getHours() + ':' + tradePointDetails.end_date.getMinutes() : '--:--') + '<br>' +
                    'Визитов:  ' + tradePointDetails.operationsCount + '<br>' +
                    'Доход:   ' + tradePointDetails.operationsSum + ' рублей<br>' +
                    'Касса:   ' + (tradePointDetails.startValue ? tradePointDetails.startValue : '') + tradePointDetails.operationsSum + ' рублей';
            var btnEmptyCashBox = cmn.createElement("button", "btn btn-success btn-xs btn-block", currentSession);
            btnEmptyCashBox.innerHTML = 'Снять кассу';
            /* ### Статистика ### */
            /*var statBar = cmn.createElement("div", "col-md-3", panelContent);
             statBar.innerHTML =
             '<span class="label label-default label-block">Статистика</span>';*/
            var graphBar = cmn.createElement("div", "col-md-9", panelContent);
            var tbBtns = cmn.createElement("div", "btn-toolbar", graphBar);
            tbBtns.role = "toolbar";
            var grpGraphBtns = cmn.createElement("div", "btn-group btn-group-xs", tbBtns);
            var buttonsGS = {};
            buttonsGS['btnIncome'] = cmn.createElement("button", "btn btn-info btn-xs", grpGraphBtns);
            buttonsGS['btnIncome'].innerHTML = 'Доход';
            buttonsGS['btnClients'] = cmn.createElement("button", "btn btn-info btn-xs", grpGraphBtns);
            buttonsGS['btnClients'].innerHTML = 'Визиты';
            buttonsGS['btnSalesValue'] = cmn.createElement("button", "btn btn-info btn-xs", grpGraphBtns);
            buttonsGS['btnSalesValue'].innerHTML = 'Объем';
            buttonsGS['btnAverangeCheck'] = cmn.createElement("button", "btn btn-info btn-xs", grpGraphBtns);
            buttonsGS['btnAverangeCheck'].innerHTML = 'Средний чек';

            var grpPeriodBtns = cmn.createElement("div", "btn-group btn-group-xs", tbBtns);
            var buttonsPS = {};
            buttonsPS['btnDay'] = cmn.createElement("button", "btn btn-info btn-xs", grpPeriodBtns);
            buttonsPS['btnDay'].innerHTML = "Д";
            buttonsPS['btnWeek'] = cmn.createElement("button", "btn btn-info btn-xs", grpPeriodBtns);
            buttonsPS['btnWeek'].innerHTML = "Н";
            buttonsPS['btnMonth'] = cmn.createElement("button", "btn btn-info btn-xs", grpPeriodBtns);
            buttonsPS['btnMonth'].innerHTML = "М";
            buttonsPS['btnQuarter'] = cmn.createElement("button", "btn btn-info btn-xs", grpPeriodBtns);
            buttonsPS['btnQuarter'].innerHTML = "К";
            buttonsPS['btnYear'] = cmn.createElement("button", "btn btn-info btn-xs", grpPeriodBtns);
            buttonsPS['btnYear'].innerHTML = "Г";

            var graphDiv = cmn.createElement("div", "chart-area", graphBar, "chart-area-" + tradePointDetails.org_trade_point_id);
            //addChart(graphDiv);
            createChart('quarter', graphDiv);
        } catch (e) {
            panelContent.innerHTML =
                    '<span class="label label-warning">\n\
<span class="glyphicon glyphicon-user"></span>   <strong>Нет данных!</strong> Возможно, эта точка еще не открывалась</span>';
            Logger.warning(e);
        }
    }

    showOnContainer();
}
