/**
 * 
 * @author minya92
 */
function BillItems() {
    var self = this, model = this.model, form = this;
    
   function saveItemsCost(){
       model.qBillItems.beforeFirst();
       while(model.qBillItems.next()){
           if(model.qBillItems.cursor.item_cost != model.qBillItems.cursor.new_cost){
               //model.qDelBillCost.params.item_id = model.qBillItems.cursor.wh_items_id;
               model.qCloseItemCost.params.item_id = model.qBillItems.cursor.wh_items_id;
               //model.qDelBillCost.executeUpdate();
               model.save();
               model.qCloseItemCost.executeUpdate();
               model.save();
               if(model.qBillItems.cursor.new_cost){
                   //ВОТ ТУТ НЕЕБИЧЕСКОЕ ЗЛО! ОН МЕНЯЕТ ЦЕНУ ПРЕД ЗАПИСИ
                  model.qAddItemCost2.insert(
                      model.qAddItemCost2.schema.item_id, model.qBillItems.cursor.wh_items_id,
                      model.qAddItemCost2.schema.item_cost, model.qBillItems.cursor.new_cost,
                      model.qAddItemCost2.schema.start_date, new Date()
                  );
                  model.save();
               } else {
                  model.qAddItemCost2.push({
                      item_id: model.qBillItems.cursor.wh_items_id,
                      start_date: new Date(),
                      end_date: new Date()
                  });
                  model.save();
               }

               
           }
       }
   }

    function itemTypeOnScrolled(evt) {//GEN-FIRST:event_itemTypeOnScrolled
        model.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qBillItems.requery();
    }//GEN-LAST:event_itemTypeOnScrolled

    function itemTypeOnRequeried(evt) {//GEN-FIRST:event_itemTypeOnRequeried
        model.params.item_type = model.itemType.cursor.wh_item_types_id;
        model.qBillItems.requery();
    }//GEN-LAST:event_itemTypeOnRequeried

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        saveItemsCost();
        model.qBillItems.requery();
    }//GEN-LAST:event_buttonActionPerformed
}
