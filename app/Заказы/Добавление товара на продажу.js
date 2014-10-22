/**
 * 
 * @author minya92
 */
function AddBillItems() {
   var self = this, model = this.model, form = this;
   var billItemsModule = new ServerModule("BillItemsModule");
   var userSession = new ServerModule("UserSession");
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
               if(new_cost){
                    billItemsModule.addItem(model.qBillItems.cursor.wh_items_id, new_cost, model.qBillItems.cursor.billMeasure);
               }
           }
       }
   }

    function itemTypeOnScrolled(evt) {//GEN-FIRST:event_itemTypeOnScrolled
        if (model.modified&&confirm('Сохранить изменения?')){
            saveItemsCost();
        }
        model.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qBillItems.requery();
    }//GEN-LAST:event_itemTypeOnScrolled

    function itemTypeOnRequeried(evt) {//GEN-FIRST:event_itemTypeOnRequeried
        model.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qBillItems.requery();
    }//GEN-LAST:event_itemTypeOnRequeried

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        saveItemsCost();
        //model.qBillItems.requery();
        form.close(true);
    }//GEN-LAST:event_buttonActionPerformed

    function formWindowClosed(evt) {//GEN-FIRST:event_formWindowClosed

    }//GEN-LAST:event_formWindowClosed

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        
    }//GEN-LAST:event_formWindowOpened
}
