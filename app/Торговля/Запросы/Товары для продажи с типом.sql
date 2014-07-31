/**
 *
 * @author Alexey
 * @name qTradeItemsAndType
 * @public
 * @readonly
 * !!! Может затупить если будет несколько цен !!!
 */
Select t1.trade_item_type_id as r_id, t1.type_name as r_name, t1.parent_type as r_parent
, null as r_cost, null as r_old_cost
, null as r_selected, null as r_selected2, null as add2TP
From trade_item_type t1
where :sort_by_type = true
union all
select t.trade_items_id as r_id, t.item_name as r_name
, case when :sort_by_type = true then t.item_type else null end as r_parent
, t2.item_cost as r_cost, t2.item_cost as r_old_cost
, case when t2.trade_point_id is not null then true else false end as r_selected
, case when t2.trade_point_id is not null then true else false end as r_selected2 
, null as add2TP
From trade_items t
left join trade_items_cost t2 on t.trade_items_id = t2.item_id
                                and t2.franchazi_id = :franchazi_id
                                and t2.trade_point_id = :trade_point_id
 Where ((:franchazi_id = t2.franchazi_id
    and :trade_point_id = t2.trade_point_id 
    and now() >= t2.start_date
    and (now() < t2.end_date or t2.end_date is null)) or :show_only_present = false)