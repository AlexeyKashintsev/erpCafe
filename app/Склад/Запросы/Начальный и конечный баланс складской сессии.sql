/**
 *
 * @author mike
 * @name querySessionBalance
 * @manual
 * @public
 */ 
Select * 
From wh_session_balance t1
 Where :session_id = t1.session_id