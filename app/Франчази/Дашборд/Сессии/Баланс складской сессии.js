/**
 * 
 * @author Alexey
 */
function WHSessionBalance(aContainer) {
    var self = this, model = this.model;
    
    var tHeader = ["Наименование", "Остаток на начало смены", "Расход", "Текущий остаток"];
    self.container = cmn.createElement("div", "", aContainer);
    var grid = new wf.Table(self.container, tHeader);
    
    
    self.setSession = function(aSession) {
        model.qWHSessionBalance.params.session_id = aSession;
        grid.prepare();
        model.qWHSessionBalance.requery(function() {
            model.qWhItemsOnTP.requery(function() {
                var data = [];
                model.qWhItemsOnTP.forEach(function(cursor) {
                    var itemData = model.qWHSessionBalance.find(model.qWHSessionBalance.schema.item_on_tp_id, cursor.items_on_tp_id)[0];
                    if (itemData)
                        data.push([
                            cursor.item_name,
                            (itemData.start_value ? itemData.start_value : "--") + ' ' + (cursor.item_measure ? cursor.item_measure : ""),
                            (itemData.used_value ? itemData.used_value : "--") + ' ' + (cursor.item_measure ? cursor.item_measure : ""),
                            (itemData.final_value ? itemData.final_value : "--") + ' ' + (cursor.item_measure ? cursor.item_measure : "")
                        ]);
                    else
                        data.push([
                            cursor.item_name,
                            "Нет данных!"
                        ]);
                });
                grid.setData(data);
            });
        });
    };

    self.setWarehouse = function(aWarehouse) {
        model.params.trade_point_id = aWarehouse;
    };

    self.setTradePoint = self.setWarehouse;

    function qWhItemsOnTPOnRequeried(evt) {//GEN-FIRST:event_qWhItemsOnTPOnRequeried

    }//GEN-LAST:event_qWhItemsOnTPOnRequeried
}