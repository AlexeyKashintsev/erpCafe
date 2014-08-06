/**
 *
 * @author mike
 * @name countItems
 * @readonly
 */ 
Select t1.session_id, t1.item_id, sum(t1."value" * t.multiplier) AS used_value
, t2.start_value, t2.start_value + sum(t1."value" * t.multiplier) AS final_value,
t3.item_name
From wh_movements t1
 Inner Join wh_movement_types t on t.wh_movement_types_id = t1.movement_type
 Inner Join wh_session_balance t2 on t1.session_id = t2.session_id
 and t1.item_id = t2.item_id
 Inner Join wh_items t3 on t2.item_id = t3.wh_items_id
 Where :session_id = t1.session_id
 Group by t1.item_id, t1.session_id, t2.start_value, t3.item_name