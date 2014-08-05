/**
 *
 * @name usersByName
 * @public
 * @rolesallowed admin franchazi
 * TODO non public
 */ 
Select * 
From mtd_users t1
 Where :usr_name = t1.usr_name