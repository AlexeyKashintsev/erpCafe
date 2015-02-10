/**
 *
 * @author Work
 * @public
 * @name qTradeItemsWithSearch
 */ 
Select * 
From wh_items t1
 Left Join trade_items_on_tp t on t1.wh_items_id = t.item_id
