/**
 *
 * @author Alexey
 * @name qWHSessionBalance
 * @public
 */ 
Select t1.item_id, t3.item_name, t3.item_measure
, t1.start_value, sum(-1 * t."value" * t2.multiplier) as used_value
, (case when sum(t."value" * t2.multiplier) is not null then sum(t."value" * t2.multiplier)
     else 0 end) + t1.start_value as final_value
, t1.end_value
From wh_session_balance t1
 Left Join wh_movements t on t1.session_id = t.session_id
 and t1.item_id = t.item_id
 Left Join wh_movement_types t2 on t.movement_type = t2.wh_movement_types_id
 Left Join wh_items t3 on t1.item_id = t3.wh_items_id
 Where :session_id = t1.session_id
group by t1.item_id, t3.item_name, t3.item_measure, t1.start_value, t1.end_value