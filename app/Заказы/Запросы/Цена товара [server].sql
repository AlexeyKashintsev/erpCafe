/**
 * @author minya92
 * @name qItemBillCostServer
 * @writable bill_item_cost
 */ 
Select * ,
false as selected, 1 as item_count
From bill_item_cost t1
 Inner Join wh_items t on t1.item_id = t.wh_items_id
 Where t1.end_date is null 
 And (:item_id = t.wh_items_id or :item_id is null)