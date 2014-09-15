/**
 *
 * @author minya92
 * @name qServiceList
 * @public
 */ 
Select * 
From bill_services t1
 Inner Join bill_item_cost t on t1.bill_services_id = t.item_id
 Where (:service_id = t1.bill_services_id or :service_id is null) 
 And t.end_date is not null