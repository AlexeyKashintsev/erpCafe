/**
 * @public
 * @stateless
 */ 
function BillItemsModule() {
    var self = this, model = this.model;
    var billModule  = new BillModule();
    
    /*
     * Добавление товара на продажу
     */
    self.addItem = function(anItemId, aCost, aMeasure){
        model.qBillItems.params.item_id = anItemId;
        model.qBillItems.requery();
        if(model.qBillItems.length > 0 ){
            // Удаление записей с пустыми ценами
            model.qDelBillCost.params.item_id = model.qBillItems.cursor.items_catalog_id;
            model.qDelBillCost.executeUpdate();
            // Закрытие всех цен по товару (end_date)
            model.qCloseItemCost.params.item_id = model.qBillItems.cursor.items_catalog_id;
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
            model.qDelBillCost.params.item_id = model.qBillItems.cursor.items_catalog_id;
            model.qDelBillCost.executeUpdate();
            // Закрытие всех цен по товару (end_date)
            model.qCloseItemCost.params.item_id = model.qBillItems.cursor.items_catalog_id;
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
     * Список доступных для продажи товаров
     */
    self.getItemsForBill = function(){
        var items = [], i = 0;
        model.qItemBillCost.beforeFirst();
        while(model.qItemBillCost.next()){
            items.push({
                pId         :   i, 
                pName       :   model.qItemBillCost.cursor.item_name, 
                pDef        :   model.qItemBillCost.cursor.item_measure, 
                pCost       :   model.qItemBillCost.cursor.item_cost,
                pItemId     :   model.qItemBillCost.cursor['item_id']
            });
        }
        return items;
    };
    /*
     * Покупка товаров
     */
    self.buyItems = function(anOperationId){
        var aStatus = billModule.getSelfPropertyValue("OP_STATUS_PAID"); // оплачен    
        return billModule.setStatusBillOperation(anOperationId, aStatus);
    };
    
    self.createOperation = function(anItems, anAccountId){
        var aStatus = billModule.getSelfPropertyValue("OP_STATUS_CREATE"); // просто создан
        var sum = 0;
        for(var i in anItems){
            model.qItemBillCost.params.item_id = anItems[i].itemId;
            model.requery();
            sum = sum + model.qItemBillCost.cursor.item_cost * anItems[i].count;
            anItems[i].costId =  model.qItemBillCost.cursor.bill_item_cost_id;
        }
        Logger.info(sum);
        var operationId = billModule.addBillOperation(anAccountId, billModule.getSelfPropertyValue("OPERATION_DEL_BUY"), sum, aStatus);
        if(operationId){
            for(var j in anItems){
                model.qAddItemsOnOperation.insert();
                model.qAddItemsOnOperation.cursor.operation_id = operationId;
                model.qAddItemsOnOperation.cursor.cost_id = anItems[j].costId;
                model.qAddItemsOnOperation.cursor.items_count = anItems[j].count;
            }
            model.save();
            return operationId;
        }  else 
            return false;
    };
}
