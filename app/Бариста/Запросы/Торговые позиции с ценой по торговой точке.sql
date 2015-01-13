/**
 *
 * @manual 
 * @author Alexey
 * @name TradeItemsByTradePointWithCost
 * @readonly
 * @public
TODO trade_item_type_id
 */ 
Select tp.item_id, t1.item_cost, t.item_name
, t2.type_name, t2.trade_item_type_id 
From trade_items_on_tp tp
 Inner Join trade_items_cost t1 on t1.item_on_tp = tp.trade_items_on_tp_id
 Inner Join wh_items t on tp.item_id = t.wh_items_id
 Inner Join trade_item_type t2 on t.item_type = t2.trade_item_type_id
 Where :trade_point_id = tp.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date <= t1.end_date or t1.end_date is null)