/**
 *
 * @author Alexey
 * @name qCostModifiersOnTP
 * @public
 * @manual
 */ 
Select Distinct t1.price_type, t.type_name
From trade_items_cost t1
 Inner Join items_on_tp tp on t1.item_on_tp = tp.items_on_tp_id
 Inner Join trade_price_types t on t.trade_price_types_id = t1.price_type
 Where :trade_point_id = tp.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date < t1.end_date or t1.end_date is null)