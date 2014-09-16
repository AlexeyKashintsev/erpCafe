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
 and (t1.end_date =
    (Select max(case when t2.end_date is null then now() else t2.end_date end) 
     From org_session t2
     Where t2.trade_point = q.org_trade_point_id) or t1.end_date is null)
 order by end_date desc
