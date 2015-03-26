/**
 *
 * @author minya92
 * @name qBillItems
 * @public
 */ 
Select *, t2.item_cost AS new_cost, null AS billMeasure 
From items_catalog t1
 Left Join bill_item_cost t2 on t1.items_catalog_id = t2.item_id
 Where (:item_type = t1.item_type or :item_type is null or :item_type = 0)
 and (t2.end_date is null or (t2.start_date is not null
 and t2.end_date is not null
 and t2.item_cost is null))
 and (:item_id = t1.items_catalog_id or :item_id is null)