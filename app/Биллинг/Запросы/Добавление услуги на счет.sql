/**
 *
 * @author minya92
 * @name qAddService
 * @public
 */ 
Select * 
From bill_services_accounts t1
 Where (:service_id = t1.service_id or :service_id is null)
 and (:account_id = t1.account_id or :account_id is null)