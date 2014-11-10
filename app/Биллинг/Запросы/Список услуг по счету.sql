/**
 * @readonly
 * @author minya92
 * @name qServiceListByAccount
 * @public
 */ 
Select * 
From bill_services t1
 Inner Join bill_services_accounts t on t1.bill_services_id = t.account_service_id
 Inner Join bill_item_cost t2 on t.account_service_id = t2.service_id
 Where (:service_id = t1.bill_services_id or :service_id is null)
 and t2.end_date is null
 and :account_id = t.account_id