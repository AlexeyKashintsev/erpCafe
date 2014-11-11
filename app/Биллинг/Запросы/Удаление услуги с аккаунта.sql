/**
 * @author minya92
 * @name qDelServiceFromAccount
 * @manual 
 */ 
Select * 
From bill_services_accounts t1
Where :service_id = t1.account_service_id
and :account_id = t1.account_id
and :service_account_id = t1.bill_services_accounts_id