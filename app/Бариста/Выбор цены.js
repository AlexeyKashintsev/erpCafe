/**
 * 
 * @author Alexey
 * @module
 */ 
function PriceModifier(aContainer, aParent, aTradePoint, anActualDate) {
    var self = this, model = this.model;
    var IWF = new ItemsWidgetFactory();
    var cost_modifiers = [];
    self.parent = aParent;
    
    var modifiers_body = cmn.createElement('div', 'price_modifiers', aContainer);
    model.сostModifiersOnTP.params.trade_point_id = aTradePoint;
    model.сostModifiersOnTP.params.actual_date = anActualDate ? anActualDate : new Date();
    model.сostModifiersOnTP.requery(function() {
            var buttons = [];
            model.сostModifiersOnTP.forEach(function(data) {
                buttons[data.price_type] = {
                    d_name  :   data.type_name,
                    d_title :   null,
                    active  :   data.price_type == 10
                };
            });
            new wf.ButtonGroup(buttons, modifiers_body, "typeSelector", self.parent.itemsSelector.setActivePrice);
    });
}
