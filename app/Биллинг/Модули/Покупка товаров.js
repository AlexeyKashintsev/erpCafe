/**
 * @public
 * @author minya92
 * @module
 */ 
function BillItemsModule() {
    var self = this, model = this.model;
    /*
     * Добавление товара на продажу
     */
    self.addItem = function(anItemId, aCost, aMeasure){
        model.qBillItems.params.item_id = anItemId;
        model.qBillItems.requery();
        if(model.qBillItems.length > 0 ){
            // Удаление записей с пустыми ценами
            model.qDelBillCost.params.item_id = model.qBillItems.cursor.wh_items_id;
            model.qDelBillCost.executeUpdate();
            // Закрытие всех цен по товару (end_date)
            model.qCloseItemCost.params.item_id = model.qBillItems.cursor.wh_items_id;
            model.qCloseItemCost.executeUpdate();
            //Добавление
            model.qItemBillCost.insert();
            model.qItemBillCost.cursor.item_id = anItemId;
            model.qItemBillCost.cursor.item_cost = aCost;
            model.qItemBillCost.cursor.start_date= new Date();
            model.qItemBillCost.cursor.bill_measure = aMeasure;
            model.save();
        }
    };
    /*
     * Удаление товара
     */
    self.delItem = function(anItemId){
        model.qBillItems.params.item_id = anItemId;
        model.qBillItems.requery();
        if(model.qBillItems.length > 0 ){
            // Удаление записей с пустыми ценами
            model.qDelBillCost.params.item_id = model.qBillItems.cursor.wh_items_id;
            model.qDelBillCost.executeUpdate();
            // Закрытие всех цен по товару (end_date)
            model.qCloseItemCost.params.item_id = model.qBillItems.cursor.wh_items_id;
            model.qCloseItemCost.executeUpdate();
            model.qItemBillCost.insert();
            //Удаление
            model.qItemBillCost.cursor.item_id = anItemId;
            model.qItemBillCost.cursor.start_date= new Date();
            model.qItemBillCost.cursor.end_date = new Date();
            model.save();
        }
    };
    /*
     * 
     */
    self.getItemsForBill = function(){
        var items = [], i = 0;
        model.qItemBillCost.beforeFirst();
        while(model.qItemBillCost.next()){
            items.push({
                pId         :   i, 
                pName       :   model.qItemBillCost.cursor.item_name, 
                pDef        :   model.qItemBillCost.cursor.item_measure, 
                pCost       :   model.qItemBillCost.cursor.item_cost
            });
        }
        return items;
    };
}
