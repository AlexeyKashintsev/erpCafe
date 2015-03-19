/**
 *
 * @author mike
 * @name itemType
 * @public
 */ 
select * from
(Select *
From items_types t1
union all
Select 0 as items_types_id, 'Все' as type_description, null as parent_type
, null as franchazi_id, true as trade_type, true as wh_type
From items_types t) q
Where (:franchazi_id = q.franchazi_id or q.franchazi_id is null)
group by items_types_id, type_description, parent_type, franchazi_id
 , trade_type, wh_type
order by q.items_types_id