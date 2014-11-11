/**
 *
 * @author stipjey
 * @name qPersonalData
 * @public
 */ 
Select t1.client_id, t1.usr_name, t1.first_name
, t1.middle_name, t1.last_name, t1.birthday
, t1.address, t1.phone, t1.email
, t1.reg_date, t1.bonus_category 
From client_personal_data t1
 Where :phone = t1.phone or :email = t1.email or :user_name = t1.usr_name
 or :id = t1.client_id