/**
 *
 * @author minya92
 * @name qTradeItemsOnTP
 * @public
TODO ReadOnly
 */ 
Select *
From items_on_tp t1
 Where :trade_point = t1.trade_point_id
 and (:item_id = t1.item_id or :item_id is null)