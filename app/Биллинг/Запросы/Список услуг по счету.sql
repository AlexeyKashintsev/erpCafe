/**
 *
 * @author minya92
 * @name qServiceListByAccount
 * @public
 */ 
Select * 
From bill_services t1
 Inner Join bill_services_accounts t on t.service_id = t1.bill_services_id
 Where :account_id = t.account_id