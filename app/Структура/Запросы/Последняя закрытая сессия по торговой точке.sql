/**
 *
 * @author ak
 * @name qLastClosedSessionOnTradePoint
 * @manual
 * @public
 */ 
Select t1.org_session_id 
From org_session t1
 Where :trade_point_id = t1.trade_point
 and end_date = (select max(t.end_date)
from org_session t
 Where :trade_point_id = t.trade_point)