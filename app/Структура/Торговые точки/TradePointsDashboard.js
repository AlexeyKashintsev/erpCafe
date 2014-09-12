/**
 * 
 * @author Alexey
 */
function TradePointsDashboard() {
    var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);
    self.tradePoints = {};
    var show = false;
    
    self.setFranchazi = function(aFranchaziId){
       P.Logger.info("FranchaziID = " + aFranchaziId);
        model.params.franchazi_id = aFranchaziId;
        model.listTradePoints.params.franchazi_id = aFranchaziId;
        model.listTradePoints.requery(function(){
           P.Logger.info("TradePoints count = " + model.listTradePoints.length);
            generateDashboardInfo();
        });
    };
    
    self.manualShow = function(aContainer) {
        self.container = aContainer;
    };
    
    function generateDashboardInfo() {
        model.listTradePoints.forEach(function(aTP){
            self.tradePoints[aTP.org_trade_point_id] = new TradePointCommonInfo(aTP);
        });
    }
    
    var TradePointCommonInfo = function(aTradePointDetails) {
        //this.form = new TradePointCommonDetails();
        //this.form.setTradePoint(aTradePointDetails.org_trade_point_id);
        
        this.panel = cmn.createElement("div", "panel panel-primary trade_point", self.container);
        var heading = cmn.createElement("div", "panel-heading", this.panel);
        heading.innerHTML = '<h3 class="panel-title">' + aTradePointDetails.tp_name + '</h3>';
        var tpAddress = cmn.createElement("span", "label label-info", heading);
        tpAddress.innerHTML = aTradePointDetails.tp_address;
        
        var panelContent = cmn.createElement("div", "panel-body", this.panel);
        //var row = cmn.createElement("div", "row", panelContent);
        var currentSession = cmn.createElement("div", "col-md-3", panelContent);//row);
        try {
            currentSession.innerHTML = 
                (aTradePointDetails.end_date ? '<button class="label label-default label-block">Смена закрыта</button>' :
                '<button class="label label-success label-block">Точка работает</button>') + '<br>' +
                '<span class="glyphicon glyphicon-user"></span>   ' + aTradePointDetails.user_name + '<br>' +
                '<span class="glyphicon glyphicon-calendar"></span>   ' + aTradePointDetails.start_date.toLocaleDateString() + '<br>' +
                '<span class="glyphicon glyphicon-time"></span>   ' + aTradePointDetails.start_date.getHours() + ':' + aTradePointDetails.start_date.getMinutes() + ' | ' +
                (aTradePointDetails.end_date ? aTradePointDetails.end_date.getHours() + ':' + aTradePointDetails.end_date.getMinutes() : '--:--') + '<br>' +
                'Визитов:  ' + aTradePointDetails.operationsCount + '<br>' +
                'Доход:   ' + aTradePointDetails.operationsSum + ' рублей<br>' + 
                'Касса:   ' + (aTradePointDetails.startValue ? aTradePointDetails.startValue : '') + aTradePointDetails.operationsSum + ' рублей';
            var btnEmptyCashBox = cmn.createElement("button", "btn btn-success btn-xs btn-block", currentSession);
            btnEmptyCashBox.innerHTML = 'Снять кассу';
            /* ### Статистика ### */
            var statBar = cmn.createElement("div", "col-md-3", panelContent);
            statBar.innerHTML =
                    '<span class="label label-default label-block">Статистика</span>';
            var graphBar = cmn.createElement("div", "col-md-6", panelContent);
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
        } catch(e) {
            panelContent.innerHTML = 
                 '<span class="label label-warning">\n\
<span class="glyphicon glyphicon-user"></span>   <strong>Нет данных!</strong> Возможно, эта точка еще не открывалась</span>';
           P.Logger.warning(e);
        }
        //this.form.showOnPanel(this.commonData);
        
    };
    
    self.show = function() {
        form.show();
    };
}
