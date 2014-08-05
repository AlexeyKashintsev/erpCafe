/**
 *
 * @author mike
 * @name queryItemsInWH
 * @public
 */ 
Select * 
From wh_items_in_warehouse t1
 Where :warehouse_id = t1.warehouse