/**
 *
 * @author Alexey
 * @name qWHItemsByFranchazi
 */ 
Select t.item_id 
From org_trade_point t1
 Inner Join wh_items_in_warehouse t on t1.org_trade_point_id = t.warehouse
 Where :franchazi_id = t1.franchazi_id
group by t.item_id