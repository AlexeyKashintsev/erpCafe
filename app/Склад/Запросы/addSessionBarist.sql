/**
 *
 * @author mike
 * @name addSessionBarist
 */ 
Select * 
From wh_session t1
 Inner Join wh_session_balance t on t.session_id = t1.wh_session_id
 Where :trade_point_id = t1.warehouse