/**
 *
 * @author Alexey
 * @name TradeItemCost
 */ 
Select *
, case when t1.franchazi_id is not null and t1.trade_point_id is not null then 3
else (case when t1.franchazi_id is not null then 2 else 1 end) end as c_level
From trade_items_cost t1
 Where :item_id = t1.item_id
 and (:franchazi_id = t1.franchazi_id or t1.franchazi_id is null)
 and (:trade_point_id = t1.trade_point_id or t1.trade_point_id is null)
 and :date_id >= t1.start_date
 and (:date_id <= t1.end_date or t1.end_date is null)