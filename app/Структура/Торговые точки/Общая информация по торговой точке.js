/**
 * 
 * @author Alexey
 * @module
 */
function TradePointCommonInfo(aTradePointDetails, aContainer) {
    var self = this, model = this.model;
    var container = aContainer;
    var graphBar = null;
    var chartDiv = null;
    
    
    var chartOptions = {};
    var chartMaker = new ChartMaker();
    var chart = null;
    
    var buttonsCS = {};
    var buttonsPS = {};
    
    var charts = {
        income      :   {
            name    :   'Доход',
            data_s  :   model.qTradePointIncomeByPeriod
        }
    };
    
    var selectedPeriod  = null;
    var selectedChart   = null;
    
    var tradePointDetails = aTradePointDetails;

    self.setPeriod = function(aPeriod) {
        cmn.setActiveButton(buttonsPS, buttonsPS[aPeriod]);
        selectedPeriod = chartMaker.getPeriod(aPeriod);
        createChart();
    };
    
    self.setChart = function(aChartName) {
        cmn.setActiveButton(buttonsCS, buttonsCS[aChartName]);
        selectedChart = charts[aChartName];
        createChart();
    };

    function createChart() {
        if (!!selectedPeriod && !!selectedChart) {            
            selectedChart.data_s.params.g_value = selectedPeriod.g_value;
            selectedChart.data_s.params.begDate = selectedPeriod.startDate;
            selectedChart.data_s.params.trade_point_id = tradePointDetails.org_trade_point_id;
            selectedChart.data_s.requery(function() {
                if (!!chartDiv) {
                        graphBar.style.height = graphBar.offsetHeight + 'px';
                        $(chartDiv).remove();
                    }
                chartDiv = cmn.createElement("div", "chart-area", graphBar, "chart-area-" + tradePointDetails.org_trade_point_id);
                chartOptions = {
                    container       :   chartDiv,
                    chartTitle      :   selectedChart.name + " за " 
                            + (selectedPeriod.c_title ? selectedPeriod.c_title : selectedPeriod.d_title).toLowerCase()
                            + " с "
                            + selectedPeriod.startDate.getFullYear() + "/"
                            + (selectedPeriod.startDate.getMonth() + 1) + "/"
                            + selectedPeriod.startDate.getDate(),
                    dataName        :   selectedChart.name,
                    height          :   200
                };
                var data = [{
                    dataSource  :   selectedChart.data_s,
                    dataType    :   'continious',
                    chartType   :   'column',
                    chartName   :   selectedChart.name,
                    options     :   {}
                }];
                
                chart = chartMaker.Chart(data, chartOptions, selectedPeriod);
            });
        }
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
            
            graphBar = cmn.createElement("div", "col-md-9", panelContent);
            var tbBtns = cmn.createElement("div", "btn-toolbar", graphBar);            
            tbBtns.role = "toolbar";
            var grpGraphBtns = cmn.createElement("div", "btn-group btn-group-xs", tbBtns);            
            for (var j in charts) {
                buttonsCS[j] = cmn.createElement("button", "btn btn-info btn-xs", grpGraphBtns);
                buttonsCS[j].innerHTML = charts[j].name;
                buttonsCS[j].chartName = j;
                buttonsCS[j].onclick = function() {
                    self.setChart(this.chartName);
                };
            }
            
            var grpPeriodBtns = cmn.createElement("div", "btn-group btn-group-xs", tbBtns);
            var periods = chartMaker.getPeriods();
            for (var j in periods) {
                buttonsPS[j] = cmn.createElement("button", "btn btn-info btn-xs", grpPeriodBtns);
                buttonsPS[j].innerHTML = periods[j].d_name;
                buttonsPS[j].title = periods[j].d_title;
                buttonsPS[j].period = j;
                buttonsPS[j].onclick = function() {
                    self.setPeriod(this.period);
                };
            }
            //addChart(graphDiv);
            self.setChart("income");
            self.setPeriod("week");
        } catch (e) {
            panelContent.innerHTML =
                    '<span class="label label-warning">\n\
<span class="glyphicon glyphicon-user"></span>   <strong>Нет данных!</strong> Возможно, эта точка еще не открывалась</span>';
            Logger.warning(e);
        }
    }

    showOnContainer();
}
