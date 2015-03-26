/**
 *
 * @author Alexey
 * @name dsWHMovementsByPeriod
 * @public
 */ 
Select t3.item_name, t1.value AS in_val
, t1.value AS out_val
From wh_movements t1
 Inner Join wh_movement_types t on t1.movement_type = t.wh_movement_types_id
 Inner Join org_session t2 on t2.org_session_id = t1.session_id
 Inner Join items_catalog t3 on t1.item_id = t3.items_catalog_id
 Where :trade_point_id = t2.trade_point
 and (:start_date < t2.end_date or t2.end_date is null)
 and (:end_date >= t2.start_date or :end_date is null)
 Group by t1.item_id, t3.item_name