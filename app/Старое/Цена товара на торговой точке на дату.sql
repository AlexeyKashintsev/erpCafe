/**
 *
 * @author Alexey
 * @name TradeItemCost_deprecated
 * @public
 * @rolesallowed admin franchazi
 */ 
Select * 
From items_on_tp tp
 Inner Join trade_items_cost t1 on t1.item_on_tp = tp.items_on_tp_id
 Where :item_id = tp.item_id
 and (:trade_point_id = tp.trade_point_id or :trade_point_id is null)
 and :date_id >= t1.start_date
 and (:date_id <= t1.end_date or t1.end_date is null)