/**
 *
 * @author stipjey
 * @name qSessionOnTradePoint
 * @manual
 */ 
Select t1.org_session_id
From org_session t1
Where :trade_point_id = t1.trade_point 
and (:begin_date <= t1.start_date) 
and (:end_date >= t1.end_date or t1.end_date is null) 
order by t1.end_date desc