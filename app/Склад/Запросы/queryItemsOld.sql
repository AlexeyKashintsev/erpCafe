/**
 *
 * @author mike
 * @name queryItemsOld
 */ 
Select * 
From wh_items t1
 Left Join wh_items_in_warehouse t on t.item_id = t1.wh_items_id
 and (:trade_point_id = t.warehouse or t.warehouse is null)