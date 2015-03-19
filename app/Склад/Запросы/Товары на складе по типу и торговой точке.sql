/**
 * 
 * @author Alexey
 * @name qWarehouseItemsOnTradePoint
 * @public
 * @readonly
 */ 
Select t1.items_catalog_id, t.trade_point_id, t1.item_name
, t1.franchazi_id, t1.item_type 
From items_on_tp t
 Inner Join items_catalog t1 on t.item_id = t1.items_catalog_id
 Where (:item_type = t1.item_type or :item_type = 0 or :item_type is null)
 and :trade_point_id = t.trade_point_id
 and t.wh_item = true
 and (:franchazi_id = t1.franchazi_id or :franchazi_id is null)
 Group by items_catalog_id, item_name, franchazi_id, item_type, t.trade_point_id