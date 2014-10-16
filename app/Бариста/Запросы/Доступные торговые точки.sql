/**
 *
 * @author Alexey
 * @name qTradeItemsByUser
 * @public
 * @readonly
 */ 
Select t2.org_trade_point_id, t2.tp_name, t2.tp_address 
From org_tp_users t1
 Left Join org_session t on t1.trade_point_id = t.trade_point
 and t.end_date is null
 Inner Join org_trade_point t2 on t1.trade_point_id = t2.org_trade_point_id
 Where :user_name = t1.user_name
 and t2.tp_active = true
 and t.org_session_id is null