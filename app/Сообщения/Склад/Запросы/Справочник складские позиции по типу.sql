/**
 *
 * @author Alexey
 * @name qWarehouseItems
 * @writable wh_items
 * @public
 */ 
Select t1.wh_items_id, t1.item_name, t1.item_type
, t1.franchazi_id, t1.item_measure 
From wh_items t1
 Inner Join #qSubtypes q on q.wh_item_types_id = t1.item_type
 Left Join #qWHItemsByFranchazi q1 on t1.wh_items_id = q1.item_id
 Where :show_type is null or :show_type = 0
 or :show_type = 1 and q1.item_id is not null
 or :show_type = 2 and t1.franchazi_id is not null
 and :show_type = t1.item_type