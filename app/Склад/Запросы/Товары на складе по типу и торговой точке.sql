/**
 * 
 * @author Alexey
 * @name qWarehouseItemsOnTradePoint
 * @public
 * @readonly
 */ 
Select t1.wh_items_id, t.trade_point_id, t1.item_name
, t1.franchazi_id, t1.item_type 
From trade_items_on_TP t
 Inner Join wh_items t1 on t.item_id = t1.wh_items_id
 Where (:item_type = t1.item_type or :item_type = 0 or :item_type is null)
 and :trade_point_id = t.trade_point_id
 and t.wh_item = true
 and (:franchazi_id = t1.franchazi_id or :franchazi_id is null)
 Group by wh_items_id, item_name, franchazi_id, item_type, t.trade_point_id