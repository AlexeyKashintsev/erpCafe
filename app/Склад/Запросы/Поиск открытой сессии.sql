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
 or :session_id = t1.org_session_id)
 and end_date is null
/* and ((:closed = true and (end_date is null or end_date is not null)) or (:closed is null and end_date is null))*/