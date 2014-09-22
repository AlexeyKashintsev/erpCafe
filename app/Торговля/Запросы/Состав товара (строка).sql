/**
 * @name qTradeItemContents
 * @public
 * @rolesallowed admin franchazi
 */ 
Select t1.item_name, t1.trade_items_id, t1.item_type, t1.franchazi_id,
    null as contents
From trade_items t1
where :item_id = t1.trade_items_id or :item_id is null