/**
 *
 * @author minya92
 * @name qChangedService
 * @manual
 * @public
 */ 
Update bill_services_accounts SET changed = true 
Where :service_id = bill_services_accounts.account_id /* ПЕРЕДЕЛАТЬ */