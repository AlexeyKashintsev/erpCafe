/**
 *
 * @author minya92
 * @name qServiceList
 */ 
Select * 
From bill_services t1
 Where :service_id = t1.bill_services_id or :service_id is null