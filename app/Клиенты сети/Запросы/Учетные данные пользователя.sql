/**
 *
 * @author stipjey
 * @name qAddNewUser
 * @writable mtd_users
 * @public
 */ 
Select t1.usr_name, t1.usr_passwd 
From mtd_users t1
 Where :user_name = t1.usr_name