/**
 *
 * @author Alexey
 * @name qOpenedOrLastSessionFranchazi
 * @public
 * @writable org_session
 */
Select *
From #listTradePoints q
 Left Join org_session t1 on q.org_trade_point_id = t1.trade_point
 and t1.start_date =
    (Select max(t2.start_date) 
     From org_session t2
     Where t2.trade_point = q.org_trade_point_id)
