/**
 * 
 * @manual 
 * @author mike
 * @name deleteUserFromTradePoint
 */
Delete
From org_tp_users
where :user_name = org_tp_users.user_name 
and :trade_point_id = org_tp_users.trade_point_id