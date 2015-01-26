/**
 *
 * @author Alexey
 * @name tradeItemsCostByTP
 * @manual
 * @readonly
 * @public
 */ 
Select t1.trade_items_cost_id, tp.item_id, t.item_name
, t.item_measure, t.item_description, t.item_picture
, t.item_type, t.bar_code, t1.item_cost, t1.price_type, tp.color
, Case  When tp.trade_type is null Then t.trade_type else tp.trade_type End AS trade_type 
From trade_items_on_tp tp
 Inner Join trade_items_cost t1 on t1.item_on_tp = tp.trade_items_on_tp_id
 Inner Join wh_items t on tp.item_id = t.wh_items_id
 Where (:item_id = tp.item_id or :item_id is null)
 and :trade_point_id = tp.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date < t1.end_date or t1.end_date is null)
 and (:price_type = t1.price_type)