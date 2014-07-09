/**
 *
 * @author mike
 * @name listTP
 */ 
Select * 
From org_trade_point t1
 Inner Join org_tp_users t on t1.org_trade_point_id = t.trade_point_id
 Inner Join mtd_users t2 on t.user_name = t2.usr_name
 Inner Join org_franc_users t3 on t3.user_name = t2.usr_name
 Where (:franchazi_tp_id = t1.franchazi_id or :franchazi_tp_id is null)
 and (:franchazi_id = t3.franchazi_id or :franchazi_id is null)