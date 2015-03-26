/**
 *
 * @author minya92
 * @name qTradeItemsOnTP
 * @public
TODO ReadOnly
 */ 
Select * 
From items_on_tp t1
 Where :trade_point = t1.trade_point_id or (:item_on_tp = t1.items_on_tp_id or :item_on_tp is null)