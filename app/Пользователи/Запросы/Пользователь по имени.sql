/**
 *
 * @name usersByName
 * @rolesallowed admin franchazi
 * TODO NONPUBLIC!!!! 
 */ 
Select * 
From mtd_users t1
 Where :usr_name = t1.usr_name
 or :phone = t1.usr_phone