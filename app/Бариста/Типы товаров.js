/**
 * 
 * @author Alexey
 * @module
 */
function TypesSelector(aContainer, aParent, aTradePoint, anActualDate) {
    var self = this, model = this.model;
    var IWF = new ItemsWidgetFactory();
    var changeItemType = new ChangeItemType();
    self.parent = aParent;
    
    self.modes = {
        TRADE   :   0,
        SETUP   :   1
    };
    
    self.mode = self.modes.TRADE;
    
    function onTypeClick(aTypeID) {
        if (aTypeID == 0) {
            $('.Sortable.itemDescription').show();
        } else if(aTypeID == "setting"){
            changeItemType.showModal();
        } else {
            $('.itemDescription').hide();
            $('.itemDescription.tt_' + aTypeID).show();
        }
    };

    self.setOperationMode = function(aMode) {
        self.mode = aMode;
        switch (aMode) {
            case (self.modes.SETUP) : {
                
                break;
            }
            case (self.modes.TRADE) : {
                
                break;
            }
        }
    };
    
    var types_body = cmn.createElement('div', 'item_type_selector row', aContainer);

    model.tradeTypes4TP.params.trade_point_id = aTradePoint;
    model.tradeTypes4TP.params.actual_date = anActualDate ? anActualDate : new Date();
    model.tradeTypes4TP.requery(function() {
        var buttons = [{d_name: 'Все', active: true}];
        model.tradeTypes4TP.forEach(function(data) {
            buttons[data.trade_item_type_id] = {
                d_name: data.type_name,
                d_title: "Все товары"
            };
        });
        
        new wf.ButtonGroup(buttons, types_body, "typeSelector", onTypeClick);
    });
    
    var button = [];
    button['Setting'] = {
            d_name: "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span>",
            d_title: "Настройка"
        };
    new wf.ButtonGroup(button, types_body, "typeSelector", onTypeClick);    
    
}
