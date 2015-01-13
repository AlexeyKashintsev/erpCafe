/**
 *
 * @author Алексей
 * @name prCloseItemCost
 * @manual
 */ 
Update trade_items_cost
 set end_date = now()
 Where item_on_tp = (select trade_items_on_tp_id from trade_items_on_tp tp
                        where
                         (:trade_point_id = tp.trade_point_id or :trade_point_id is null)
                         and (:item_id = tp.item_id)
                         and end_date is null) and price_type = :price_type