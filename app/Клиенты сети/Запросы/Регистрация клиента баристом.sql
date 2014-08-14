/**
 *
 * @author stipjey
 * @name qClientRegistration
 * @writable client_personal_data
 */ 
Select t.client_id, t.usr_name, t.email
, t.reg_date 
From client_personal_data t