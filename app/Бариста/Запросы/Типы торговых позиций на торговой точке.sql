/**
 *
 * @author Alexey
 * @name tradeTypes4TP
 * @public
 TODO Переделать под item_type из item_cost
 */ 
Select t.type_name, t.trade_item_type_id, t.parent_type
From trade_items_cost t1
 Inner Join wh_items t2 on t2.wh_items_id = t1.item_id
 Inner Join trade_item_type t on t.trade_item_type_id = t2.item_type
 Where :franchazi_id = t1.franchazi_id
 and :trade_point_id = t1.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date <= t1.end_date or t1.end_date is null)
 Group by t.parent_type, t.trade_item_type_id, t.type_name