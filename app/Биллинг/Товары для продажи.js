/**
 * 
 * @author minya92
 */
function BillItems() {
   var self = this, model = P.loadModel(this.constructor.name), form = P.loadForm(this.constructor.name, model);

   /* !!! Пример управления
   function addNewItem(aaa) {}
   
   self.actions = [
       {    title   :   'Добавить товар',
            glyph   :   'icon-add3',
            action  :   addNewItem
       }
   ];
   */
   function saveItemsCost(){
       model.qBillItems.beforeFirst();
       while(model.qBillItems.next()){
           if(model.qBillItems.cursor.item_cost != model.qBillItems.cursor.new_cost){
               var new_cost = model.qBillItems.cursor.new_cost;
               model.qBillItems.cursor.new_cost = model.qBillItems.cursor.item_cost;
               // Удаление записей с пустыми ценами
               model.qDelBillCost.params.item_id = model.qBillItems.cursor.wh_items_id;
               model.qDelBillCost.enqueueUpdate();
               // Закрытие всех цен по товару (end_date)
               model.qCloseItemCost.params.item_id = model.qBillItems.cursor.wh_items_id;
               model.qCloseItemCost.enqueueUpdate();
               if(new_cost){
                    model.qItemBillCost.insert();
                    model.qItemBillCost.cursor.item_id = model.qBillItems.cursor.wh_items_id;
                    model.qItemBillCost.cursor.item_cost = new_cost;
                    model.qItemBillCost.cursor.start_date= new Date();
                    model.qItemBillCost.cursor.bill_measure = model.qBillItems.cursor.billMeasure;
               } else {
                    model.qItemBillCost.insert();
                    model.qItemBillCost.cursor.item_id = model.qBillItems.cursor.wh_items_id;
                    model.qItemBillCost.cursor.start_date= new Date();
                    model.qItemBillCost.cursor.end_date = new Date();
                     model.qItemBillCost.cursor.bill_measure = model.qBillItems.cursor.billMeasure;
               }
               model.save();
           }
       }
   }

    model.itemType.onScrolled = function(evt) {//GEN-FIRST:event_itemTypeOnScrolled
        if (model.modified&&confirm('Сохранить изменения?')){
            saveItemsCost();
        }
        model.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qBillItems.requery();
    };//GEN-LAST:event_itemTypeOnScrolled

    model.itemTypeOnRequeried=function(evt) {//GEN-FIRST:event_itemTypeOnRequeried
        model.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qBillItems.requery();
    };//GEN-LAST:event_itemTypeOnRequeried

    form.button.onActionPerformed = function(evt) {//GEN-FIRST:event_buttonActionPerformed
        saveItemsCost();
        model.qBillItems.requery();
    };//GEN-LAST:event_buttonActionPerformed
    
    self.show = function() {
        form.show();
    };

    form.onWindowOpened = function(event) {
        model.itemType.requery();
        model.qBillItems.requery();
        model.qBillMeasures.requery();
        model.qItemBillCost.requery();
        // TODO Добавьте здесь свой код
    };

}
