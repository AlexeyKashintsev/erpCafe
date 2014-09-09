/**
 *
 * @author minya92
 * @name qAddService
 * @public
 */ 
Select * 
From bill_services_accounts t1
 Inner Join bill_service_cost t on t1.service_cost_id = t.bill_service_cost_id
 Inner Join bill_services t2 on t.service_id = t2.bill_services_id
 Where (:service_id = t2.bill_services_id or :service_id is null)
 and (:account_id = t1.account_id or :account_id is null)