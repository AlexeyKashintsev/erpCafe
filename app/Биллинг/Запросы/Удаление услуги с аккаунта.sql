/**
 *
 * @author minya92
 * @name qDelServiceFromAccount
 * @manual 
 * @public
 */ 
Delete 
From bill_services_accounts t1
Where :service_id = t1.service_cost_id
and :account_id = t1.account_id
and :service_account_id = t1.bill_services_accounts_id