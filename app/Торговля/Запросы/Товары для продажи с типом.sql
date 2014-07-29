/**
 *
 * @author Alexey
 * @name qTradeItemsAndType
 */ 
Select t1.trade_item_type_id as r_id, t1.type_name as r_name, t1.parent_type as r_parent
From trade_item_type t1
union all
select t.trade_items_id as r_id, t.item_name as r_name, t.item_type as r_parent
From trade_items t