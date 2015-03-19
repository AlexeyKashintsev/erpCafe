/**
 * @public
 * @author Work
 * @name qGetItem
 */ 
Select * 
From items_catalog t1
 Where :barcode = t1.bar_code
 or :item_id = t1.items_catalog_id
 or :item_type = t1.item_type