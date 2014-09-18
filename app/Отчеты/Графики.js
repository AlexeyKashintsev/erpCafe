/**
 * 
 * @author Alexey
 * @module
 */ 
function ChartMaker() {
    var self = this, model = this.model;
    
    var periods = {
        day: {
            days    : 1,
            interval: 1,
            g_value : "YY/MM/DD/HH24",
            d_format: "HH24:00",
            d_name  : "Д",
            d_title : "День",
            c_title : "сутки"
        },
        week: {
            days: 7,
            interval: 1, //Измеряется в часах
            g_value: "YY/MM/DD/HH24",
            d_format: "HH24:00",
            d_name  : "Н",
            d_title : "Неделя",
            c_title : "неделю"
        },
        month: {
            days: 30,
            interval: 24,
            g_value: "YY/MM/DD",
            d_format: "HH24:00",
            d_name  : "М",
            d_title : "Месяц"
        },
        quarter: {
            days: 90,
            interval: 24 * 7,
            g_value: "YY/MM/DD",
            d_format: "HH24:00",
            d_name  : "К",
            d_title : "Квартал"
        },
        year: {
            days: 360,
            interval: 24 * 30,
            g_value: "YY/MM/DD",
            d_format: "HH24:00",
            d_name  : "Г",
            d_title : "Год"
        }
    };
    
    self.getPeriod = function(aPeriodName) {
        var period = periods[aPeriodName];
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
        
        return period;
    };
    
    self.getPeriods = function() {
        return periods;
    };
    
    function generateContiniousDataArray(aDataSource, aPeriod) {
        var timeAxis = [];
        var cDate = new Date(aPeriod.startDate);
        var dataArray = [];
        for (var j = 0; j <= aPeriod.days * 24 / aPeriod.interval; j++) {
            timeAxis.push(new Date(cDate));
            var endDate = new Date(cDate);
            endDate.setHours(endDate.getHours() + aPeriod.interval);
            var value = 0;
            aDataSource.beforeFirst();
            while (aDataSource.next()) {
                var dt = new Date(aDataSource.cursor.d_value);
                if (dt <= endDate && dt > cDate)
                    value += aDataSource.cursor.sm;
            }
            if (value) {
                dataArray.push(value);
            }
            cDate.setHours(cDate.getHours() + aPeriod.interval);
        }
        Logger.info(dataArray);
        return dataArray;
    }
    
    function getSeries(aData, aPeriod) {
        var series = [];
        for (var j in aData) {
            var data = aData[j];
            var seria = data.options ? aData[j].options : {};
            seria.name = data.chartName;
            if (data.chartType) seria.type = data.chartType;
            switch (data.dataType) {
                case 'continious' : {
                        seria.data = generateContiniousDataArray(aData.dataSource);
                        seria.pointStart = Date.UTC(aPeriod.startDate.getFullYear()
                                                    , aPeriod.startDate.getMonth()
                                                    , aPeriod.startDate.getDate()
                                                    , aPeriod.startDate.getHours()+1),
                        seria.pointInterval = 3600 * 1000 * aPeriod.interval;
                        break
                }
            }
            series.push[seria];
        }
        return series;
    }

//    var aData = {
//        dataSource  :   dataSource,
//        dataType    :   dataType,
//        chartType   :   chartType,
//        chartName   :   chartName,
//        options     :   {}
//    };
    self.Chart = function(aData, aChartOptions, aPeriod) {
        //var chartData = generateContiniousDataArray(aData, aPeriod);
        return new Highcharts.Chart({
            chart: {
                renderTo: aChartOptions.container,
                type: 'column',
                height: aChartOptions.height ? aChartOptions.height : null
            },
            legend: {
                enabled: false,
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            title: {
                text: aChartOptions.chartTitle
            },
            yAxis: {
                title: {
                    text: aChartOptions.chartName
                }
            },
            xAxis: {
                type: 'datetime'
            },
            series: getSeries(aData, aPeriod)/*[{
                    name: aChartOptions.dataName,
                    data: chartData,
                    pointStart: Date.UTC(aPeriod.startDate.getFullYear()
                        , aPeriod.startDate.getMonth()
                        , aPeriod.startDate.getDate()
                        , aPeriod.startDate.getHours()+1),
                    pointInterval: 3600 * 1000 * aPeriod.interval
                }]*/
        });
    };
}

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