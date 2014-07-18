/**
 *
 * @author mike
 * @name qTradeItemTypes
 */ 
select * from
(Select *
From trade_item_type t1
union all
Select 0 as trade_item_type_id, 'Все товары' as type_name, null as parent_type
, null as settings
From trade_item_type t) q
group by trade_item_type_id, type_name, parent_type, settings
order by q.trade_item_type_id desc