/**
 *
 * @author mike
 * @name countItems
 * @writable 
 */ 
Select t1.item_id, sum(t1."value" * t.multiplier) AS sum_value 
From wh_movements t1
 Inner Join wh_movement_types t on t.wh_movement_types_id = t1.movement_type
 Where :session_id = t1.session_id
 Group by t1.item_id, t1.session_id