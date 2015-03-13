/**
 * 
 * @author Alexey
 * @module
 */ 
function DeviceSampleSettings() {
    var self = this, model = this.model;
    var storedSettings = {};
    
    self.getAvaibleDevices = function() {
        return {
            scales      :   {
                display : "Весы",
                values  : [{
                        name : "none"
                    }, {
                    name     :   "Mercury-315",
                    settings :  {
                        port    :   {
                            display :   "Порт",
                            values  :   getAvaibalePorts()
                        }
                    },
                    actions : [
                        {
                            display :   "Тест",
                            command :   "test"
                        }
                    ]
                }, {
                    name     :   "SuperScale",
                    settings :  {
                        port    :   {
                            display :   "Порт",
                            values  :   getAvaibalePorts()
                        },
                        weigth  :   {
                            display : "Диапазон веса",
                            values  : ["--", "0-20", "20-50", "50-150"]}
                    }
                }]
            },
            printers    :   {
                display : "Чековый принтер",
                values  : [{
                        name : "none"
                    }, {
                        name     :   "Mercury MS",
                        settings :  {
                            port    :   {
                                display :   "Порт",
                                values  :   getAvaibalePorts()
                            }
                        }
                    }
                ]
            }
        };
    };
    
    self.setSettings = function(aSettings) {
        storedSettings = aSettings;
        console.log(aSettings);
    };
    
    self.getSettings = function() {
        return storedSettings;
    };
    
    function getAvaibalePorts() {
        return ["Не задан", "com1", "com2", "com4", "com9"];
    }
}
