/**
 *
 * @author Alexey
 * @name qWarehouseItems
 * @public
 */ 
Select * 
From wh_items t1
 Where :item_type = t1.item_type or :item_type = 0