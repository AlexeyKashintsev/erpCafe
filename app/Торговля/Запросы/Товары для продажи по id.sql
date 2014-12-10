/**
 *
 * @author mike
 * @name qTradeItemsId
 * @public
 * @rolesallowed admin franchazi
 */ 
Select * 
From wh_items t1
 Where :item_id = t1.wh_items_id