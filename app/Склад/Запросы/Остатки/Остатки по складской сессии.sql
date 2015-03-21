/**
 *
 * @author Alexey
 * @name qWHSessionBalance
 * @public
 */ 
Select t1.item_on_tp_id, t1.item_id, t3.item_name, t4.short_string
, t3.item_measure, t1.start_value, sum(-1 * t."value" * t2.multiplier) AS used_value
, (Case  When sum(t."value" * t2.multiplier) is not null Then sum(t."value" * t2.multiplier) else 0 End) + t1.start_value AS final_value, t1.end_value 
From items_on_tp t4 
 Left Join wh_session_balance t1 on t1.item_on_tp_id = t4.items_on_tp_id and :session_id = t1.session_id
 Left Join wh_movements t on :session_id = t.session_id and t4.item_id = t.item_id
 Left Join wh_movement_types t2 on t.movement_type = t2.wh_movement_types_id
 Left Join items_catalog t3 on t4.item_id = t3.items_catalog_id
where t4.wh_item = true
 Group by t1.item_on_tp_id, t1.item_id, t3.item_name, t3.item_measure
, t1.start_value, t1.end_value, t4.short_string