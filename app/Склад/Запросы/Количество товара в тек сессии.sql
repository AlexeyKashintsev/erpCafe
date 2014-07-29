/**
 *
 * @author mike
 * @name querySessionBalance
 * @manual
 */ 
Select * 
From org_session_balance t1
 Where :session_id = t1.session_id