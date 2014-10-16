/**
 *
 * @author mike
 * @name queryOpenedSession
 * @manual
 * @public
 */ 
Select * 
From org_session t1
 Where (:trade_point_id = t1.trade_point
 or (:session_id = t1.org_session_id))
 and end_date is null