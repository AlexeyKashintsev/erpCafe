/**
 *
 * @author Work
 * @name qGetFranchaziPhones
 * @manual
 */ 
Select t.usr_phone 
From mtd_users t
 Inner Join mtd_groups t1 on t.usr_name = t1.usr_name
where t1.group_name = 'franchazi' and t.usr_phone is not null