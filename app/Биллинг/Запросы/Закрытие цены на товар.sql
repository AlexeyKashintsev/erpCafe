/**
 *
 * @author minya92
 * @name qCloseItemCost
 * @manual
 */ 

UPDATE bill_item_cost
SET end_date = now() 
WHERE (:item_id = item_id and end_date is null)

