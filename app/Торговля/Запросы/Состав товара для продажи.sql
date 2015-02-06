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
 Where :trade_item_id = t1.trade_item