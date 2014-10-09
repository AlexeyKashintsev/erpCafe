/**
 *
 * @author Alexey
 * @name qTradeItemsAndType
 * @public
 * @readonly
 * !!! Может затупить если будет несколько цен !!!
 */
Select t1.trade_item_type_id as r_id, t1.type_name as r_name
, 'aaa' as r_parent
, null as r_cost, null as r_old_cost
, null as r_selected, null as r_selected2, null as add2TP
From trade_item_type t1
left join trade_items t on t1.trade_item_type_id = t.item_type
left join trade_items_cost t2 on t.trade_items_id = t2.item_id
where :sort_by_type = true