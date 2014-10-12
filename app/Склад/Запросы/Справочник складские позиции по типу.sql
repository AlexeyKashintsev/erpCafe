/**
 *
 * @author Alexey
 * @name qWarehouseItems
 * @public
 */ 
Select t1.wh_items_id, t1.item_name, t1.item_type, t1.franchazi_id, t1.item_measure
From wh_items t1
 Inner Join #qSubtypes q on q.wh_item_types_id = t1.item_type