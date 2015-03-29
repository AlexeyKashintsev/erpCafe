/**
 * 
 * @author Alexey
 * @module
 */ 
function CSSManager() {
    var self = this, model = this.model;
    
    CSS_M = this;
    
    var classes = getLayout();
    var elements = [];
    
    function getLayout() {
        return {
            DeviceSettings: '',                                                 //'panel panel-primary settings',
            ClientPhoneSelector: '',                                            //'baristaOrder panel panel-primary',
            OrderList: '',                                                      //'baristaOrder panel panel-primary',
            TradeItem: '',                                                      //'itemDescription',
            TradeItemAdd: '',                                                   //'itemDescription add-trade-item',
            BalanceMeter: '',                                                   //'weight_calculator',
            Table: '',
            DateTimePeriodPicker: '',
            ActionList: '',                                                     //'list-group',
            ActionListElement: ''                                               //'list-group-item'
        };
    }
    
    function getCSSClass(aClass) {
        return classes[aClass];
    };
    
    self.getCSSClass = getCSSClass;
    
    self.registerHTMLComponent = function(anElement, aClass) {
        $(anElement).addClass(getCSSClass(aClass));
        if (!elements[aClass])
            elements[aClass] = [];
        elements[aClass].push(anElement);
    };
}
