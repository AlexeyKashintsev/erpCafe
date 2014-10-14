/**
 *
 * @author ak
 * @name qLastSessionOnTradePoint
 * @manual
 * @public
 */ 
Select t1.org_session_id 
From org_session t1
 Where :trade_point_id = t1.trade_point
and end_date is null 
or end_date = (select t.end_date
from org_session t 
Where :trade_point_id = t.trade_point
order by t.end_date
DESC LIMIT 1
 )