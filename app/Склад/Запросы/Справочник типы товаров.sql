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
, null as measure
From wh_item_types t) q
group by wh_item_types_id, type_description, parent_type, measure
order by q.wh_item_types_id desc