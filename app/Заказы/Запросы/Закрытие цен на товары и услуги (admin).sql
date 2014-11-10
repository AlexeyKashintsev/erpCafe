/**
 * @author minya92
 * @name qCloseItemCostAdmin
 * @manual
 * @public
 * @rolesAllowedToWrite admin
 */ 

UPDATE bill_item_cost
SET end_date = now() 
WHERE (:item_id = item_id and end_date is null) 
or (:service_id = service_id and end_date is null)
