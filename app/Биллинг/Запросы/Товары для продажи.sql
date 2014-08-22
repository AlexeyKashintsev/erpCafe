/**
 *
 * @author minya92
 * @name qBillItems
 */ 
Select * ,
t2.item_cost as new_cost
From wh_items t1
 Left Join bill_item_cost t2 on t1.wh_items_id = t2.item_id
 Where (:item_type = t1.item_type or :item_type is null)
 And (t2.end_date is null or (t2.start_date is not null and t2.end_date is not null and t2.item_cost is null))