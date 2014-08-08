/**
 * @name queryUsers
 * @public
*/ 
Select t.usr_name, t.usr_passwd 
From MTD_USERS t
 Where :usr_name = t.usr_name