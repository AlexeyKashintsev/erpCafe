/**
 *
 * @author minya92
 * @name qAddService
 */ 
Select * 
From bill_services_accounts t1
 Where :service_id = t1.service_id or :service_id is null