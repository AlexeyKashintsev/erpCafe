/**
 *
 * @author Alexey
 * @name createFrancizerUser
 */ 
Select * 
From org_franc_users t1
 Where (:franchazi_id = t1.franchazi_id or :franchazi_id is null)
 and (:user_name = t1.user_name or :user_name is null)
 and (:user_name is not null or :franchazi_id is not null)