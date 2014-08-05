/**
 *
 * @author mike
 * @name qContents
 * @manual
 * @public
 * @rolesallowed admin franchazi
 */ 
Select wh_item 
From trade_items_contents t1
 Where :trade_item_id = t1.trade_item
