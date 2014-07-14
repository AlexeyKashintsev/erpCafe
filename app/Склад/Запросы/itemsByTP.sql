/**
 *
 * @author mike
 * @name itemsByTP
 */ 
Select *
From wh_items_in_warehouse t
 Inner Join wh_items t2 on t.item_id = t2.wh_items_id
, wh_session_balance t1
 Where :trade_point_id = t.warehouse
 and (t2.franchazi_id is null or :franchazi_id = t2.franchazi_id)