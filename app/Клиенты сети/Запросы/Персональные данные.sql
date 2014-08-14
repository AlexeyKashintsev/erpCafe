/**
 *
 * @author stipjey
 * @name qPersonalData
 */ 
Select client_id, usr_name, first_name
, middle_name, last_name, birthday
, address, phone, email
, reg_date 
From client_personal_data t1
 Where :phone = t1.phone
 or :email = t1.email
 or :user_name = t1.usr_name