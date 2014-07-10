/**
 *
 * @author mike
 * @name listUsersFranchaziOrTP
 * @writable mtd_users
 */ 
Select t1.usr_name, t1.usr_passwd, t1.usr_form, t1.usr_context, t1.usr_roles
, t1.usr_phone, t1.usr_email
From mtd_users t1
 left Join org_franc_users t on t.user_name = t1.usr_name
 left Join org_tp_users t2 on t2.user_name = t1.usr_name
 Where (:franchazi_id = t.franchazi_id or :franchazi_id is null)
  and (:trade_point_id = t2.trade_point_id or :trade_point_id  is null)