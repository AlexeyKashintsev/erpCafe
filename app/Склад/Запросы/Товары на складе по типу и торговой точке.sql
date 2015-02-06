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
 Left Join wh_items t1 on t.item_id = t1.wh_items_id
 Where (:item_type = t1.item_type or :item_type = 0)
 and :trade_point_id = t.trade_point_id
 and t.wh_item = true
 Group by wh_items_id, item_name, franchazi_id, item_type