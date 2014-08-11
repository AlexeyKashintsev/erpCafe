/**
 *
 * @author Alexey
 * @name qOpenedOrLastSessionFranchazi
 * @public
 */
Select *
From #listTradePoints q
 Left Join org_session t1 on q.org_trade_point_id = t1.trade_point
 and (end_date is null or t1.end_date in 
    (Select max(t2.end_date) 
     From org_session t2
     Where t2.trade_point = q.org_trade_point_id))
 order by end_date desc
