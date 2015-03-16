/**
 *
 * @author mike
 * @name itemType
 * @public
 */ 
select * from
(Select *
From wh_item_types t1
union all
Select 0 as wh_item_types_id, 'Все' as type_description, null as parent_type
, null as franchazi_id, true as trade_type, true as wh_type
From wh_item_types t) q
Where (:franchazi_id = q.franchazi_id or q.franchazi_id is null)
group by wh_item_types_id, type_description, parent_type, franchazi_id
 , trade_type, wh_type
order by q.wh_item_types_id