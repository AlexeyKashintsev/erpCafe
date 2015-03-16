/**
 * @author Alexey
 * @name tradeTypes4TP
 * @public
 * @manual
 TODO Переделать под item_type из item_cost
 */ 
Select tp.item_id, t.type_id
From trade_items_on_tp tp
 Inner Join trade_items_cost t1 on t1.item_on_tp = tp.trade_items_on_tp_id
 Inner Join trade_items_display_types t on tp.item_id = t.trade_item
 Where :trade_point_id = tp.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date <= t1.end_date or t1.end_date is null)