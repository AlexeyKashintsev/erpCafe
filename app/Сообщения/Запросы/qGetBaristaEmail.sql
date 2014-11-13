/**
 *
 * @author Work
 * @name qGetBaristaEmail
 * @manual
 */ 
Select t1.usr_email 
From mtd_users t1
 Inner Join mtd_groups t on t1.usr_name = t.usr_name
where t.group_name = 'barista' and t1.usr_email is not null