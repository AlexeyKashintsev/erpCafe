/**
 *
 * @author Alexey
 * @name qWHItemsByFranchazi
 */ 
Select t.item_id 
From org_trade_point t1
 Inner Join trade_items_on_tp t on t1.org_trade_point_id = t.trade_point_id
 Where :franchazi_id = t1.franchazi_id
group by t.item_id