/**
 *
 * @author mike
 * @name listUsersFranchaziOrTP
 * @readonly
 * @public
 * @rolesAllowed franchazi admin
 */ 
Select t1.usr_name, t1.usr_passwd, t1.usr_form
, t1.usr_context, t1.usr_roles, t1.usr_phone
, t1.usr_email, t3.group_name, t.franc_users_active
From mtd_users t1
 Left Join org_franc_users t on t.user_name = t1.usr_name
 Left Join org_tp_users t2 on t2.user_name = t1.usr_name
 Inner Join mtd_groups t3 on t3.usr_name = t1.usr_name
 Where (:franchazi_id = t.franchazi_id or :franchazi_id is null)
 and (:trade_point_id = t2.trade_point_id or :trade_point_id is null)
 and (:trade_point_id is not null or :franchazi_id is not null)
 Group by t1.usr_name, t1.usr_passwd, t1.usr_form, t1.usr_context, t1.usr_roles,
 t1.usr_phone, t1.usr_email, t3.group_name, t.franc_users_active
 Order by t1.usr_name