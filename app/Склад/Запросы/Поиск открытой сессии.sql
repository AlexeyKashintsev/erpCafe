/**
 *
 * @author mike
 * @name queryOpenedSession
 * @manual
 */ 
Select * 
From wh_session t1
 Where :trade_point_id = t1.warehouse and end_date is null