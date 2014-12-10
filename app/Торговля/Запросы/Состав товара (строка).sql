/**
 * @name qTradeItemContents
 * @public
 * @readonly
 */ 
Select t1.item_name, t1.wh_items_id, t1.item_type, t1.franchazi_id,
    null as contents
From wh_items t1
where :item_id = t1.wh_items_id or :item_id is null