/**
 *
 * @author mike
 * @name listFrancUsers
 */ 
Select * 
From org_franc_users t1
 Inner Join mtd_users t on t1.user_name = t.usr_name
 Where t1.franchazi_id = :franchazi_id