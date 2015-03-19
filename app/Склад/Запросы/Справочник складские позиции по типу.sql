/**
 *
 * @author Alexey
 * @name qWarehouseItems
 * @writable items_catalog
 * @public
 */ 
Select t1.items_catalog_id, t1.item_name, t1.item_type
, t1.franchazi_id, t1.item_measure 
From items_catalog t1
 Inner Join #qSubtypes q on q.items_types_id = t1.item_type
 Left Join #qWHItemsByFranchazi q1 on t1.items_catalog_id = q1.item_id
 Where :show_type is null or :show_type = 0
 or :show_type = 1 and q1.item_id is not null
 or :show_type = 2 and t1.franchazi_id is not null
 and :show_type = t1.item_type