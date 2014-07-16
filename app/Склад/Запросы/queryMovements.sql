/**
 *
 * @author mike
 * @name queryMovements
 */ 
Select * 
From wh_movements t1
 Where :session_id = t1.session_id