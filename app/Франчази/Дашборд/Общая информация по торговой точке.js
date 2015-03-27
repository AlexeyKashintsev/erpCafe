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
    var tradeAdminModule = new ServerModule("TradeAdminModule");
    var additionalInfo = null;
    var income = null;
    var cashBox = null;
    var tradePoint;
    var panels = {
        charts  :   {
            d_name  :   '<span class="glyphicon glyphicon-stats"></span>',
            d_title :   'Графики',
            module  :   'ChartsByTP',
            active  :   true
        },
        wharH   :   {
            d_name  :   '<span class="glyphicon glyphicon-book"></span>',
            d_title :   'Склад',
            module  :   'WHBalance'
        },
        tradeOp :   {
            d_name  :   '<span class="glyphicon glyphicon-inbox"></span>',
            d_title :   'Касса',
            module  :   'tradeOperaionsByTP'
        },
        video   :   {
            d_name  :   '<span class="glyphicon glyphicon-eye-open"></span>',
            d_title :   'Видео',
            module  :   'VideoFromTP'
        }
    };
    
    function showPanel(aPanelName) {
        $(panels[aPanelName].display.container).show();
        for (var j in panels) {
            if (j !== aPanelName)
                $(panels[j].display.container).hide();
        }
        if (panels[aPanelName].display.showData)
            panels[aPanelName].display.showData();
    }
    
    function btnWHRevisionOnClick(){
        if(!tradePointDetails.end_date&&tradePointDetails.start_date){
            alert("Сначала нужно закрыть смену!");
        } else {
            var revisionForm = new RevisionForm();
            revisionForm.setTradePoint(tradePointDetails.org_trade_point_id);
            revisionForm.showModal();
        }
    }
    
    function btnWHSetAddMovementOnClick(){
        if(tradePointDetails.end_date){
            alert("Сначала нужно открыть смену!");
        } else {
            //alert(tradePointDetails.org_session_id);
            var wHSetAddMovement = new WHSetAddMovement();
            wHSetAddMovement.setTradePoint(tradePointDetails.org_trade_point_id);
            wHSetAddMovement.showModal();
        }
    }
    
    function btnEmptyCashBoxOnClick(){
        var sum = prompt("Сумма к списанию?", 0);
        if(cashBox >= sum){
            if(tradeAdminModule.takeMoneyFromCashbox(false, sum, tradePointDetails.org_trade_point_id)){
                cashBox = cashBox - sum;
                setAdditionalInfo(income, cashBox);
                alert("Деньги списаны.");
            }
        } else  alert("В кассе нет " + sum + " рублей");
    }
    
    function btnTPSettingsOnClick() {
        tradePoint = new TradePoint();
        tradePoint.setTradePoint(tradePointDetails.org_trade_point_id);
        tradePoint.showModal();
    }
    
    function setAdditionalInfo(aDohod, aKassa){
        additionalInfo.innerHTML = "";
        additionalInfo.innerHTML = 
                'Визитов:  ' + tradePointDetails.operationsCount + '<br>' +
                'Доход:   ' + aDohod + ' рублей<br>' +
                'Касса:   ' + aKassa + ' рублей';
    }
    
    function showOnContainer() {
        var heading = cmn.createElement("div", "panel-heading", container);        
        heading.innerHTML += '<h3 class="panel-title">' + tradePointDetails.tp_name + '</h3>';
        var tpAddress = cmn.createElement("span", "label label-bw", heading);
        tpAddress.innerHTML = tradePointDetails.tp_address;
        
        var panelContent = cmn.createElement("div", "panel-body", container);
        //var row = cmn.createElement("div", "row", panelContent);
        var currentSession = cmn.createElement("div", "col-lg-2 col-md-3 col-xs-12", panelContent);//row);
        try {
            currentSession.innerHTML =
                    (tradePointDetails.end_date ? '<button class="label label-default label-block">Смена закрыта</button>' :
                            '<button class="label label-success label-block">Точка работает</button>') + '<br>' +
                    '<span class="glyphicon glyphicon-user"></span>   ' + tradePointDetails.user_name + '<br>' +
                    '<span class="glyphicon glyphicon-calendar"></span>   ' + tradePointDetails.start_date.toLocaleDateString() + '<br>' +
                    '<span class="glyphicon glyphicon-time"></span>   ' + tradePointDetails.start_date.getHours() + ':' + tradePointDetails.start_date.getMinutes() + ' | ' +
                    (tradePointDetails.end_date ? tradePointDetails.end_date.getHours() + ':' + tradePointDetails.end_date.getMinutes() : '--:--') + '<br>';              
            
            additionalInfo = cmn.createElement("span","",currentSession);
            
            var opSum = tradePointDetails.operationsSum ?  tradePointDetails.operationsSum : 0;
            var startValue = tradePointDetails.start_value ? tradePointDetails.start_value : 0;
            income = Math.round((tradePointDetails.incomeSum ? tradePointDetails.incomeSum : 0) * 100)/100;
            cashBox = Math.round((startValue + opSum)*100)/100;
            setAdditionalInfo(income, cashBox);
     
            var btnEmptyCashBox = cmn.createElement("button", "btn btn-success btn-xs btn-block", currentSession);
            btnEmptyCashBox.innerHTML = 'Снять кассу';
            btnEmptyCashBox.onclick = btnEmptyCashBoxOnClick;
            var btnWHRevision = cmn.createElement("button", "btn btn-success btn-xs btn-block", currentSession);
            btnWHRevision.innerHTML = 'Провести ревизию';
            btnWHRevision.onclick = btnWHRevisionOnClick;
            var btnWHSetAddMovement = cmn.createElement("button", "btn btn-success btn-xs btn-block", currentSession);
            btnWHSetAddMovement.innerHTML = 'Прием товаров';
            btnWHSetAddMovement.onclick = btnWHSetAddMovementOnClick;
            var btnTPSettings = cmn.createElement("button", "btn btn-success btn-xs btn-block", currentSession);
            btnTPSettings.innerHTML = 'Настройка';
            btnTPSettings.onclick = btnTPSettingsOnClick;
            
            var panelData = cmn.createElement("div", "col-lg-9 col-md-8 col-xs-11", panelContent);
            /** !SHOW CHARTS! **/
            panels.charts.display = new ChartsByTP(tradePointDetails, panelData);
           
            /** !SHOW WAREHOUSE! **/
            panels.wharH.display = new WHBalance(tradePointDetails.org_trade_point_id, panelData);//new WHMowementsByPeriod(tradePointDetails.org_trade_point_id, panelData);
            
            /** !SHOW TRADE OPERATIONS! **/
            panels.tradeOp.display = new tradeOperaionsByTP(tradePointDetails.org_trade_point_id, panelData);
            
            panels.video.display = new VideoFromTP(tradePointDetails.org_trade_point_id, panelData);
            
            /** !SHOW BUtTONS! **/
            var tbBtns = cmn.createElement("div", "col-xs-1", panelContent);            
            //tbBtns.role = "toolbar";
            buttonsSelector = new wf.ButtonGroup(panels, tbBtns, "btn btn-info", showPanel, "btn-group-vertical btn-group-md");
        } catch (e) {
            panelContent.innerHTML =
                    '<span class="label label-warning">\n\
<span class="glyphicon glyphicon-user"></span>   <strong>Нет данных!</strong> Возможно, эта точка еще не открывалась</span>';
            var btnGroup = cmn.createElement("div", "col-xs-3 btn-group", panelContent);

            var btnWHRevision = cmn.createElement("button", "btn btn-success btn-xs", btnGroup);

            btnWHRevision.innerHTML = 'Провести ревизию';
            btnWHRevision.onclick = btnWHRevisionOnClick;
            var btnTPSettings = cmn.createElement("button", "btn btn-success btn-xs", btnGroup);

            btnTPSettings.innerHTML = 'Настройка';
            btnTPSettings.onclick = btnTPSettingsOnClick;
            Logger.warning(e);
        }
    }
    
    showOnContainer();
}
