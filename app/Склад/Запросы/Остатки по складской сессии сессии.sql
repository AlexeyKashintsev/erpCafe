/**
 *
 * @author Alexey
 * @name qWHSessionBalance
 */ 
Select t1.item_id, t1.start_value, sum(t."value" * t2.multiplier) as used_value
, sum(t."value" * t2.multiplier) + t1.start_value as final_value
, t1.end_value
From wh_session_balance t1
 Left Join wh_movements t on t1.session_id = t.session_id
 and t1.item_id = t.item_id
 Inner Join wh_movement_types t2 on t.movement_type = t2.wh_movement_types_id
 Where :session_id = t1.session_id
group by t1.item_id, t1.start_value, t1.end_value