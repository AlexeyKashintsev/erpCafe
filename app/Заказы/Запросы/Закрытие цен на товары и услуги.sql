/**
 * @author minya92
 * @name qCloseItemCost
 * @manual
 * @public TODO А так ли это?
 */ 

UPDATE bill_item_cost
SET end_date = now() 
WHERE (:item_id = item_id and end_date is null) 
or (:service_id = service_id and end_date is null)
