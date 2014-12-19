/**
 *
 * @author mike
 * @name qTradeItemTypes
 * @public
 * @rolesallowed admin franchazi
 */ 
select * from
(Select *
From trade_item_type t1
union all
Select 0 as trade_item_type_id, 'Все товары' as type_name, null as parent_type
, null as settings, null as franchize_id, null as franchazi_id
From trade_item_type t) q
group by trade_item_type_id, type_name, parent_type, settings, franchize_id, franchazi_id
order by q.trade_item_type_id