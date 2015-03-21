/**
 *
 * @author Alexey
 * @name qTradeItemsOnTPwData
 * @public
 * @writable items_on_tp
 */ 
Select t1.items_on_tp_id, t1.item_id, t1.trade_point_id
, t.item_name || ' ' || short_string as full_string
, t1.color, t.item_name, t.item_picture, t.bar_code, t1.trade_item, t1.wh_item
, t1.wh_content
From items_on_tp t1
 Inner Join items_catalog t on t1.item_id = t.items_catalog_id
 Where :trade_point = t1.trade_point_id
 and (:item_id = t1.item_id or :item_id is null)