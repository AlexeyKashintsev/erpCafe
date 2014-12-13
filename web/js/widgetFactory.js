var wf = {};

wf.Table = function(aContainer, aHeader, aData, aTableClass, aHeaderClass, aBodyClass) {
    var content = cmn.createElement("table", "table table-hover " + aTableClass, aContainer);
    var thead = cmn.createElement('thead', null, content, aHeaderClass);
    var tr = cmn.createElement('tr', null, thead);
    for (var j in aHeader) {
        var th = cmn.createElement('th', 'table-title', tr);
        th.innerHTML = aHeader[j];
    }
    var tbody = null;
    
    function setData(aData, aFields) {
        function applyDataToCell(aData, aContainer) {
            th = cmn.createElement('th', 'table-body', aContainer);
            
            if ($.isArray(aData) || typeof aData == 'Object') {
                $(th).addClass('table-container');
                createTable(th, aData)
            } else {
                th.innerHTML = aData;
            }
        }
        
        $(tbody).remove();
        
        function createTable(aContainer, aDataArray) {
            var tBody = cmn.createElement('tbody', null, aContainer, aBodyClass);
            aDataArray.forEach(function(aCursor) {
                addTableRow(aCursor, tBody);
            });
            return tBody;
        }
        
        function addTableRow(aCursor, aContainer) {
            var tr = cmn.createElement('tr', aCursor.onclick ? 'clickable' : null, aContainer, null);
            if (aCursor.onclick) {
                tr.onclick = aCursor.onclick;
            }
            
            if (!aFields)
                for (var j = 0; j < aCursor.length; j++)
                    applyDataToCell(aCursor[j], tr);
            else
                for (var j in aFields)
                    applyDataToCell(aCursor[j], tr);
        }
        
        tbody = createTable(content, aData);
    }
    
    function loadShow() {
        $(tbody).remove();
        tbody = cmn.createElement('div', 'loadDiv', content);
    }
    
    if (aData)
        setData(aData)
    else
        loadShow();
    
    this.setData = setData;
    this.prepare = loadShow;
}

wf.DateTimePeriodPicker = function(aContainer, aSetPeriodFunction) {
    var self = this, model = this.model;
    
    var dtPContainer = cmn.createElement('div', 'input-prepend input-group', aContainer);
    var clnd = cmn.createElement('span','add-on input-group-addon', dtPContainer);
    cmn.createElement('i','glyphicon glyphicon-calendar fa fa-calendar', clnd);
    var dtP = cmn.createElement('input', 'form-control', dtPContainer, 'dateTimePicker');
    
    function dateToString(aDate) {
        var DD = aDate.getDate();
        var MM = aDate.getMonth() + 1;
        var YYYY = aDate.getFullYear();
        return YYYY + '/' + MM + '/' + DD;
    }
    
    self.dateToString = dateToString;
    
    function initDatePicker(aStart, aEnd) {
        dtP.value = aStart + ' - ' + aEnd;
        $(dtP).daterangepicker(
            { 
              format: 'YYYY-MM-DD',
              startDate: aStart,
              endDate: aEnd
            },
            function(start, end) {
                self.setPeriod(new Date(start), new Date(end));
            });
    }
    
    self.setPeriod = function(start, end) {
        aSetPeriodFunction(start, end);
    };
    
    self.init = function(aDaysCount) {
        var iEnd = new Date();
        var iStart = new Date();
        iStart.setDate(iStart.getDate() - aDaysCount ? aDaysCount : 7);
        var sStart = dateToString(iStart);
        var sEnd = dateToString(iEnd);
        
        try {
            initDatePicker(sStart, sEnd);
        } catch (e) {
            $.getScript("js/moment.min.js", function(){
                $.getScript("js/daterangepicker.js", function() {
                    initDatePicker(sStart, sEnd);
                });
            });
        }
        self.setPeriod(iStart, iEnd);
    };
}
