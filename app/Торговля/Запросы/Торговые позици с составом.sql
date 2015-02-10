/**
 *
 * @author Work
 * @name qTradeItemsWithContents
 * @public
 */ 
Select t1.wh_items_id, t1.item_name, t1.item_type, t1.franchazi_id, t1.item_description, 
null as contents 
From wh_items t1