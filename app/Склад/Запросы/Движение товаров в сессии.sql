/**
 *
 * @author mike
 * @name countItems
 * @readonly
 * @public
 */ 
Select t3.org_session_id as session_id, t2.items_on_tp_id, t2.item_id
, case when sum(t1."value" * t.multiplier) is not null 
then sum(t1."value" * t.multiplier)
else 0 end AS used_value 
From org_session t3
 Inner Join items_on_tp t2 on t3.trade_point = t2.trade_point_id
 Left Join wh_movements t1 on t2.items_on_tp_id = t1.item_on_tp_id and t3.org_session_id = t1.session_id
 Left Join wh_movement_types t on t.wh_movement_types_id = t1.movement_type
 Where :session_id = t3.org_session_id
 Group by t2.items_on_tp_id, t2.item_id, t3.org_session_id