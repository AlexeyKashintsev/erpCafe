/**
 *
 * @author Alexey
 * @name tradeItemsCostByTP
 * @manual
 * @readonly
 * @public
 */ 
Select t1.trade_items_cost_id, t1.item_id, t.item_name, t.item_measure
, t.item_description, t.item_picture, t.trade_type, t.item_type as wh_type
, t.bar_code, t1.item_type, t1.price_type, t1.item_cost
From trade_items_cost t1
 Inner Join wh_items t on t1.item_id = t.wh_items_id
 Where (:item_id = t1.item_id or :item_id is null)
 and :trade_point_id = t1.trade_point_id
 and :actual_date >= t1.start_date
 and (:actual_date < t1.end_date or t1.end_date is null)