/**
 * @name qTradeItemContents
 * @public
 * @readonly
 */ 
Select t1.item_name, t1.wh_items_id, t1.item_type
, t1.franchazi_id, null AS contents 
From wh_items t1
, trade_items_contents t
, wh_item_types t2
 Where :item_id = t1.wh_items_id or :item_id is null