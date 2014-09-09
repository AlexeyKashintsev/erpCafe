/**
 *
 * @author Alexey
 * @name qRolesByUserName
 * @manual
 */ 
Select * 
From mtd_groups t1
 Where :user_name = t1.usr_name