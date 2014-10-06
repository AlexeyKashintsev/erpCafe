/**
 * 
 * @author Alexey
 * @module
 */ 
function tradeOperaionsByTP(aTradePoint, aContainer) {
    var self = this, model = this.model;
    var shown = false;
    
    self.setWarehouse = function(aWarehouse) {
        model.qCashBoxOperationsByPeriod.params.tradePointId = aWarehouse;
    };
    
    self.setPeriod = function(aStartDate, anEndDate) {
        if (aStartDate) model.qCashBoxOperationsByPeriod.params.startDate = aStartDate;
        if (anEndDate) model.qCashBoxOperationsByPeriod.params.endDate = anEndDate;
    };

    self.setTradePoint = self.setWarehouse;
    
    function showItems() {
        Logger.info("Отображение данных для торговой точки " + model.params.trade_point_id);
        if (self.container&&!shown) {
            var thead = cmn.createElement('thead', null, self.container, 'wh_item_title');
            var tr = cmn.createElement('tr', null, thead);
            var nameLabel = cmn.createElement('th', 'whItemDesc', tr);
            nameLabel.innerHTML = "Дата операции";
            var startValue = cmn.createElement('th', 'whItemDesc', tr);
            startValue.innerHTML = "Тип операции";
            var usedValue = cmn.createElement('th', 'whItemDesc', tr);
            usedValue.innerHTML = "Сумма";
            var currentValue = cmn.createElement('th', 'whItemDesc', tr);
            currentValue.innerHTML = "Пользователь";
            
            var tbody = cmn.createElement('tbody', null, self.container, 'wh_item_title');
            /*for (var j in items) {
                if (!items[j].shown) {
                    tr = cmn.createElement('tr', 'whItemContainer ', tbody, 'wh_item_' + j);
                    items[j].setContainer(tr);
                }
                items[j].visualize();
            }*/
            shown = true;
        }
    };
    
    self.setTradePoint(aTradePoint);
    
    self.container = cmn.createElement("div", "tbBalanceDetails", aContainer);
    var controls = cmn.createElement('div', 'controls', self.container);
    var dtPContainer = cmn.createElement('div', 'controls', controls);
    var clnd = cmn.createElement('span','add-on input-group-addon', dtPContainer);
    cmn.createElement('i','glyphicon glyphicon-calendar fa fa-calendar', clnd);
    var dtP = cmn.createElement('input', 'form-control', clnd, 'dateTimePicker');
    /*dtP.innerHTML = '<script type="text/javascript" src="js/moment.min.js"></script>\n\
<script type="text/javascript" src="js/daterangepicker.js"></script>';*/
    Resource.loadText("../js/moment.min.js", "UTF-8", function(txt) {
        eval(txt);
        Resource.loadText("../js/daterangepicker.js", "UTF-8", function(txt) {
            eval(txt);
            $(dtP).daterangepicker(
                { 
                  format: 'YYYY-MM-DD',
                  startDate: '2013-01-01',
                  endDate: '2013-12-31'
                },
                function(start, end, label) {
                  alert('A date range was chosen: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                }
            );
        });
    });    
}
