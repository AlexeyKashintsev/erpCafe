/**
 *
 * @author Work
 * @name qTradeItemsWithContents
 * @public
 */ 
Select t1.items_catalog_id, t1.item_name, t1.item_type, t1.franchazi_id, t1.item_description, 
null as contents 
From items_catalog t1