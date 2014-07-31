/**
 *
 * @author mike
 * @name getSessions
 */ 
Select * 
From org_session t1
 Where (:trade_point_id = t1.trade_point or :trade_point_id is null)
 and   (:session_id = t1.org_session_id or :session_id is null)