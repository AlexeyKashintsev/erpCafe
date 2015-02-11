/**
 *
 * @author Alexey
 * @name qTradeItemsOnTPwData
 * @public
 * @writable trade_items_on_tp
 */ 
Select t1.trade_items_on_tp_id, t1.item_id, t1.trade_point_id
, t1.color, t.item_name, t.item_picture, t.bar_code
From trade_items_on_tp t1
 Inner Join wh_items t on t1.item_id = t.wh_items_id
 Where :trade_point = t1.trade_point_id
 and (:item_id = t1.item_id or :item_id is null)