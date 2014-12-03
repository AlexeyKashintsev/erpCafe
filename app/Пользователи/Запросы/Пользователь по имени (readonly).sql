/**
 *
 * @name usersByNameReadonly
 * @public
 * @readonly
 */ 
Select t1.*, t.group_name
From mtd_users t1
 Inner Join mtd_groups t on t1.usr_name = t.usr_name
 Where :usr_name = t1.usr_name or :phone = t1.usr_phone