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
, tp.trade_item, tp.wh_item, tp.wh_content
From trade_items_on_tp tp
 Left Join trade_items_cost t1 on t1.item_on_tp = tp.trade_items_on_tp_id
     and :actual_date >= t1.start_date
     and (:actual_date < t1.end_date or t1.end_date is null)
 Inner Join wh_items t on tp.item_id = t.wh_items_id
 Where (:item_id = tp.item_id or :item_id is null)
 and :trade_point_id = tp.trade_point_id
 and (:price_type = t1.price_type or :price_type is null)
 and (tp.trade_item = true)
order by tp.item_id