/**
 *
 * @author Alexey
 * @name TradeItemCost
 * @public
 * @rolesallowed admin franchazi
 */ 
Select * 
From trade_items_cost t1
 Where :item_id = t1.item_id
 and (:trade_point_id = t1.trade_point_id or :trade_point_id is null)
 and :date_id >= t1.start_date
 and (:date_id <= t1.end_date or t1.end_date is null)