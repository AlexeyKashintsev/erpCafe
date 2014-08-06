/**
 *
 * @author stipjey
 * @name qSessionOnTradePoint
 */ 
Select org_session_id
From org_session t1
Where :trade_point_id = t1.trade_point and
(:begin_date is NULL or :begin_date <= start_date) and
(:end_date is NULL or :end_date >= end_date) 