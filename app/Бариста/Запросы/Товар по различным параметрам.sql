/**
 * @public
 * @author Work
 * @name qGetItem
 */ 
Select * 
From wh_items t1
 Where :barcode = t1.bar_code
 or :item_id = t1.wh_items_id
 or :item_type = t1.item_type