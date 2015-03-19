/**
 * @name qTradeItemContents
 * @public
 * @readonly
 */ 
Select t1.item_name, t1.items_catalog_id, t1.item_type
, t1.franchazi_id, null AS contents 
From items_catalog t1
, trade_items_contents t
, items_types t2
 Where :item_id = t1.items_catalog_id or :item_id is null