/**
 *
 * @author mike
 * @name qContents
 * @public
 * @rolesallowed admin franchazi
 * @writable trade_items_contents
 */ 
Select * 
From trade_items_contents t1
 Inner Join items_catalog t on t1.wh_item = t.items_catalog_id
 Where :trade_item_id = t1.trade_item