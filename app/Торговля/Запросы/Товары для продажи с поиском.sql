/**
 *
 * @author Work
 * @public
 * @name qTradeItemsWithSearch
 */ 
Select * 
From items_catalog t1
 Left Join items_on_tp t on t1.items_catalog_id = t.item_id
