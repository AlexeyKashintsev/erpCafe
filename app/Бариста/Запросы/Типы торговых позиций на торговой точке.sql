/**
 * @author Alexey
 * @name tradeTypes4TP
 * @public
 * @manual
 TODO Переделать под item_type из item_cost
 */ 
Select t.parent_type, t.wh_item_types_id, t.type_description
From  trade_items_on_tp tp
 Inner Join trade_items_cost t1 on t1.item_on_tp = tp.trade_items_on_tp_id
 Inner Join wh_items t2 on t2.wh_items_id = tp.item_id
 Inner Join wh_item_types t on t.wh_item_types_id = tp.item_type
 Where :trade_point_id = tp.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date <= t1.end_date or t1.end_date is null)
 Group by t.parent_type, t.wh_item_types_id, t.type_description