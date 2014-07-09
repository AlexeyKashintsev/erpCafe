/**
 *
 * @author mike
 * @name listTradePointUsers
 */ 
Select * 
From org_trade_point t1
 Inner Join org_tp_users t on t1.org_trade_point_id = t.trade_point_id
 Inner Join mtd_users t2 on t.user_name = t2.usr_name
 Where :franchazi_id = t1.franchazi_id Or :franchazi_id is null