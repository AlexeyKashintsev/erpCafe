/**
 *
 * @author stipjey
 * @name qClientRegistration
 * @writable client_personal_data
 * @public
 * @manual
 */ 
Select t.client_id, t.usr_name, t.email
, t.reg_date 
From client_personal_data t 
where t.client_id is null