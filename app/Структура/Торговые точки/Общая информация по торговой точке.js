/**
 * 
 * @author Alexey
 * @module
 */
function TradePointCommonInfo(aTradePointDetails, aContainer) {
    var self = this, model = this.model;
    var container = aContainer;
    var tradePointDetails = aTradePointDetails;
    var buttonsSelector = null;
    
    var panels = {
        charts  :   {
            d_name  :   '<span class="glyphicon glyphicon-stats"></span>',
            d_title :   'Графики',
            active  :   true
        },
        wharH   :   {
            d_name  :   '<span class="glyphicon glyphicon-book"></span>',
            d_title :   'Склад'
        }
    };
    
    function showPanel(aPanelName) {
        $(panels[aPanelName].display.container).show();
        for (var j in panels) {
            if (j !== aPanelName)
                $(panels[j].display.container).hide();
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
            
            var panelData = cmn.createElement("div", "col-md-8", panelContent);
            /** !SHOW CHARTS! **/
            panels.charts.display = new ChartsByTP(tradePointDetails, panelData);
            
            /** !SHOW WAREHOUSE! **/
            panels.wharH.display = new WHSessionBalance(tradePointDetails.org_trade_point_id, panelData);
            
            /** !SHOW BUtTONS! **/
            var tbBtns = cmn.createElement("div", "col-xs-1", panelContent);            
            //tbBtns.role = "toolbar";
            buttonsSelector = new cmn.ButtonGroup(panels, tbBtns, "btn btn-info", showPanel, "btn-group-vertical btn-group-md");
        } catch (e) {
            panelContent.innerHTML =
                    '<span class="label label-warning">\n\
<span class="glyphicon glyphicon-user"></span>   <strong>Нет данных!</strong> Возможно, эта точка еще не открывалась</span>';
            Logger.warning(e);
        }
    }

    showOnContainer();
}
