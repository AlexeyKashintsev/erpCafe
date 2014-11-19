/**
 * 
 * @author Alexey
 * @module
 */ 
function TPActivity(aTradePoint, aContainer) {
    var self = this, model = this.model;
    var interval = null;
    var DU = new DatesUtils();
    
    var widgetTemplate = "\
        <div class='tp_name_area' id='tp_name_%TP_ID%'></div>\
        <div class='tp_activity' id='tp_activity_%TP_ID%'></div>\
        <div class='tp_activity_graph' id='tp_activity_graph_%TP_ID%'>";
    widgetTemplate = widgetTemplate.replace(/%TP_ID%/g, aTradePoint + '');
    var body = cmn.createElement("div", 'widget_body col-md-5', aContainer);
    body.innerHTML = widgetTemplate;
    body.onclick = showDataByTP;
    
    model.params.trade_point = aTradePoint;
    
    function showDataByTP() {
        var modal = new cmn.Modal('Данные торговой сессии');
        var modalBody = modal.getModalBody();
        
        var tpChart = new ChartsByTP(model.qTradePoint.cursor, modalBody);
        var chart = tpChart.getChart();
        modal.show();
    }

    function qTradePointOnRequeried(evt) {//GEN-FIRST:event_qTradePointOnRequeried
        var tpName = document.getElementById('tp_name_' + aTradePoint);
        tpName.innerHTML = '<b>' + model.qTradePoint.cursor.tp_name + '</b><br>Адрес: ' +
            (model.qTradePoint.cursor.tp_address ? model.qTradePoint.cursor.tp_address : 'не указан');
    }//GEN-LAST:event_qTradePointOnRequeried

    function qOpenedOrLastSessionOnRequeried(evt) {//GEN-FIRST:event_qOpenedOrLastSessionOnRequeried
        var active = document.getElementById('tp_activity_' + aTradePoint);
        if (!model.qOpenedOrLastSession.empty) {
            if (model.qOpenedOrLastSession.cursor.start_date > (new Date() - 3600 * 10000 * 36)) {
                active.innerHTML = "Точка работает<br>Последняя смена: "
                    + DU.dateTimeToString(model.qOpenedOrLastSession.cursor.start_date);;
                body.className += ' active';
            } else {
                if (!model.qOpenedOrLastSession.cursor.end_date) {
                    body.className += ' work_bad';    
                    active.innerHTML = "Точка работает<br>Последняя смена: "
                            + DU.dateTimeToString(model.qOpenedOrLastSession.cursor.start_date);
                } else {
                    body.className += ' not_work';
                    active.innerHTML = "Точка не работает<br>Последняя смена: "
                            + DU.dateTimeToString(model.qOpenedOrLastSession.cursor.start_date);
                }
            }
        } else {
            body.className += ' not_initialized';
            active.innerHTML = "Точка не открывалась";
        }
    }//GEN-LAST:event_qOpenedOrLastSessionOnRequeried
}
