/**
 *
 * @author mike
 * @name querySessionBalance
 */ 
Select * 
From wh_session_balance t1
 Where :session_id = t1.session_id