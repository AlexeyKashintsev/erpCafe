/**
 *
 * @author Work
 * @name qTradeItemCostsOnTradePoint
 * TODO Надо починить. Проблема с actual_date is null(actual_date >= t1.start_date
 and (actual_date < t1.end_date or t1.end_date is null)()
 */ 
Select * 
From trade_items_cost t1
 Inner Join trade_items_on_tp t on t1.item_on_tp = t.trade_items_on_tp_id
where (:actual_date >= t1.start_date
 and (:actual_date < t1.end_date or t1.end_date is null))
 and :item_id = t.item_id
 and :trade_point = t.trade_point_id