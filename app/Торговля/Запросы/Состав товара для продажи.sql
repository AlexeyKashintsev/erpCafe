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
 Inner Join wh_items t on t1.wh_item = t.wh_items_id
 Where :trade_item_id = t1.trade_item