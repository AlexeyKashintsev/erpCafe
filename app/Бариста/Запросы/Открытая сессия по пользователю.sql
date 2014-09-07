/**
 *
 * @author Alexey
 * @name qOpenedSession
 * @manual
 * @public TODO Nonpublic
 */ 
Select * 
From org_session t1
 Where :user_name = t1.user_name
 and t1.end_date is null