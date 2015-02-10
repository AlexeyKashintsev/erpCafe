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

    function onTypeClick(aTypeID) {
        if (aTypeID == 0) {
            $('.Sortable.itemDescription').show();
        } else if(aTypeID == "setting"){
            changeItemType.showModal();
        } else {
            $('.itemDescription').hide();
            $('.itemDescription.tt_' + aTypeID).show();
        }
    }
    ;

    var types_body = cmn.createElement('div', 'item_type_selector row', aContainer);

    
        var buttons = [{d_name: 'Все', active: true}];
        model.itemType.forEach(function(data) {
            buttons[data.trade_item_type_id] = {
                d_name: data.type_name,
                d_title: "Все товары"
            };
        });
        buttons['setting'] = {
            d_name: "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span>",
            d_title: "Настройка"
        };
        new wf.ButtonGroup(buttons, types_body, "typeSelector", onTypeClick);
   
}
