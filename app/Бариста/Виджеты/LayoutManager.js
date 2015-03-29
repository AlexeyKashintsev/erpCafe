/**
 * 
 * @author Alexey
 * @module
 */ 
function CSSManager() {
    var self = this, model = this.model;
    
    var classes = getLayout();
    var elements = [];
    
    function getLayout() {
        return {
            parent_row: 'row',
            action_panel: 'col-sm-5 col-md-4 col-lg-3 actionPanel',
            main_area: 'col-sm-7 col-md-8 col-lg-9 mainArea',
            itemSelector: 'item_selector v800x480',//'item_selector col-sm-8 row',
            selectorModifiers: 'modifiers', // col-sm-4 row',
            cashBackCalc: 'v800x480',
            DeviceSettings: '',                                                 //'panel panel-primary settings',
            ClientPhoneSelector: 'hidden',                                            //'baristaOrder panel panel-primary',
            OrderList: '',                                                      //'baristaOrder panel panel-primary',
            TradeItem: 'no-padding',                                                      //'itemDescription',
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
    
    self.initTradeLayout = function() {
        
    };
    
    function initMainLayout() {
        //var body = document.getElementById('body');
        //NAVBAR
        //var prow = cmn.createElement("div", getCSSClass('parent_row'), body);
        self.registerHTMLComponent(document.getElementById('actionPanel'), 'action_panel');
        self.registerHTMLComponent(document.getElementById('mainArea'), 'main_area');
    }
    
    initMainLayout();
}
