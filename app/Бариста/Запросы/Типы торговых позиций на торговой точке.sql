/**
 *
 * @author Alexey
 * @name tradeTypes4TP
 * @public
 TODO Переделать под item_type из item_cost
 */ 
Select t.type_name, t.trade_item_type_id, t.parent_type
From  trade_items_on_tp tp
 Inner Join trade_items_cost t1 on t1.item_on_tp = tp.trade_items_on_tp_id
 Inner Join wh_items t2 on t2.wh_items_id = tp.item_id
 Inner Join trade_item_type t on t.trade_item_type_id = t2.item_type
 Where :trade_point_id = tp.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date <= t1.end_date or t1.end_date is null)
 Group by t.parent_type, t.trade_item_type_id, t.type_name