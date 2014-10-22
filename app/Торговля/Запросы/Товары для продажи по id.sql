/**
 *
 * @author mike
 * @name qTradeItemsId
 * @public
 * @rolesallowed admin franchazi
 */ 
Select * 
From trade_items t1
 Where :item_id = t1.trade_items_id