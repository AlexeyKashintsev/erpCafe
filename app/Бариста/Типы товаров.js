/**
 * 
 * @author Alexey
 * @module
 */
function TypesSelector(aContainer, aParent, aTradePoint, anActualDate) {
    var self = this, model = this.model;
    var IWF = new ItemsWidgetFactory();
    //var changeItemType = new ChangeItemType();
    self.parent = aParent;
    model.itemType.params.franchazi_id = session.getFranchazi();
    var types_body = cmn.createElement('div', 'item_type_selector row', aContainer);
    
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

    function itemTypeOnRequeried(evt) {//GEN-FIRST:event_itemTypeOnRequeried
        var buttons = [{d_name: 'Все', active: true}];
        model.itemType.forEach(function(data) {
            if (data.trade_type)
                buttons[data.wh_item_types_id] = {
                    d_name: data.type_description,
                    d_title: data.type_description
                };
        });
        new wf.ButtonGroup(buttons, types_body, "typeSelector", onTypeClick);
    }//GEN-LAST:event_itemTypeOnRequeried
}
