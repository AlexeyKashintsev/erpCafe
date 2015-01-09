/**
 *
 * @author Алексей
 * @name prCloseItemCost
 * @manual
 */ 
Update trade_items_cost
 set end_date = now()
 Where (:franchazi_id = franchazi_id or :franchazi_id is null)
 and (:trade_point_id = trade_point_id or :trade_point_id is null)
 and (:price_type = price_type or :price_type is null)
 and (:item_id = item_id)
 and end_date is null