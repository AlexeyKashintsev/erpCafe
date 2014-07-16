/**
 *
 * @author mike
 * @name getSessions
 */ 
Select * 
From wh_session t1
 Where (:trade_point_id = t1.warehouse or :trade_point_id is null)
 and   (:session_id = t1.wh_session_id or :session_id is null)