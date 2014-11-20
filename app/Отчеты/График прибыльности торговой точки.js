/**
 * 
 * @author Alexey
 * @module
 */ 
function ChartsByTP(aTradePointDetails, aContainer) {
    var self = this, model = this.model;
    
    var tradePointDetails = aTradePointDetails;
    
    self.container = null;
    var chartDiv = null;
    var periods = null;    
    var chartOptions = {};
    var chartMaker = new ChartMaker();
    var chart = null;
    var buttonsCS = {};
    var buttonsPS = {};
    var selectedPeriod  = null;
    var selectedChart   = null;    
    var charts = {
        income      :   {
            d_name  :   'Доход',
            data_s  :   model.qTradePointIncomeByPeriod,
            active  :   true
        }
    };

    self.setPeriod = function(aPeriodName) {
        selectedPeriod = chartMaker.getPeriod(aPeriodName);
        createChart();
    };
    
    self.setChart = function(aChartName) {
        selectedChart = charts[aChartName];
        createChart();
    };
    
    self.getChart = function() {
        return chart;
    };

    function createChart() {
        if (!!selectedPeriod && !!selectedChart) {            
            selectedChart.data_s.params.g_value = selectedPeriod.g_value;
            selectedChart.data_s.params.begDate = selectedPeriod.startDate;
            selectedChart.data_s.params.trade_point_id = tradePointDetails.org_trade_point_id;
            selectedChart.data_s.requery(function() {
                if (!!chartDiv) {
                        self.container.style.height = self.container.offsetHeight + 'px';
                        $(chartDiv).remove();
                    }
                chartDiv = cmn.createElement("div", "chart-area", self.container, "chart-area-" + tradePointDetails.org_trade_point_id);
                chartOptions = {
                    container       :   chartDiv,
                    chartTitle      :   selectedChart.d_name + " за " 
                            + (selectedPeriod.c_title ? selectedPeriod.c_title : selectedPeriod.d_title).toLowerCase()
                            + " с "
                            + selectedPeriod.startDate.getDate() + "/"
                            + (selectedPeriod.startDate.getMonth() + 1) + "/"
                            + selectedPeriod.startDate.getFullYear(),
                    dataName        :   selectedChart.d_name,
                    height          :   200
                };
                var data = [{
                    dataSource  :   selectedChart.data_s,
                    dataType    :   'continious',//'fake'
                    chartType   :   'column',
                    chartName   :   selectedChart.name,
                    options     :   {}
                }];
                
                chart = chartMaker.Chart(data, chartOptions, selectedPeriod);
                
                setTimeout(function() {
                    chart.reflow();
                }, 500);
            });
        }
    }
    
    self.container = cmn.createElement("div", "col-md-12", aContainer);
    var tbBtns = cmn.createElement("div", "btn-toolbar", self.container);            
    tbBtns.role = "toolbar";
    buttonsCS = new cmn.ButtonGroup(charts, tbBtns, "btn btn-info btn-xs", self.setChart);
    periods = chartMaker.getPeriods();
    buttonsPS = new cmn.ButtonGroup(periods, tbBtns, "btn btn-info btn-xs", self.setPeriod);
}
