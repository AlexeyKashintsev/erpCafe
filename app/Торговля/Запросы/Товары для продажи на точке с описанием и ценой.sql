/**
 *
 * @author Alexey
 * @name qTradeItemsOnTPwDataAndCost
 * @public
 * @writable items_on_tp
 */
select items_on_tp_id, item_id, trade_point_id, full_string, color, item_name
, item_picture, bar_code, trade_item, wh_item, wh_content
, max(buying_cost) as buying_cost, max(buying_cost) as buying_cost_orig
, max(selling_cost) as selling_cost, max(selling_cost) as selling_cost_orig
From (
Select t1.items_on_tp_id, t1.item_id, t1.trade_point_id
, t.item_name || ' ' || t1.short_string AS full_string, t1.color, t.item_name
, t.item_picture, t.bar_code, t1.trade_item
, t1.wh_item, t1.wh_content, t1.supplier
, case when q.price_type = 0 then q.item_cost else 0 end as buying_cost
, case when q.price_type = 10 then q.item_cost else 0 end as selling_cost
From items_on_tp t1
 Inner Join items_catalog t on t1.item_id = t.items_catalog_id
 Inner Join #tradeItemsByTP q on t1.items_on_tp_id = q.item_on_tp
 Where :trade_point = t1.trade_point_id
 and (:item_id = t1.item_id or :item_id is null)
 and (t1.wh_item = true or t1.trade_item = true)) q1
group by items_on_tp_id, item_id, trade_point_id, full_string, color, item_name
, item_picture, bar_code, trade_item, wh_item, wh_content, supplier
 Order by supplier, item_name