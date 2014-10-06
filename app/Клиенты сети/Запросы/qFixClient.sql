/**
 *
 * @author Work
 * @name qFixClient
 */ 
update client_personal_data t
set t.client_id = (select t1.bill_accounts_id from bill_accounts t1
where t.usr_name = t1.user_id)