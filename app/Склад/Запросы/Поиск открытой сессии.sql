/**
 *
 * @author mike
 * @name queryOpenedSession
 * @manual
 */ 
Select * 
From org_session t1
 Where :trade_point_id = t1.trade_point
 and end_date is null