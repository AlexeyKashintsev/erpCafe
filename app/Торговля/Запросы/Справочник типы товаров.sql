/**
 *
 * @author mike
 * @name itemType
 * @public
 */ 
Select *
From items_types t1
Where (:franchazi_id = t1.franchazi_id or t1.franchazi_id is null)
group by items_types_id, type_description, parent_type, franchazi_id
, trade_type, wh_type
order by items_types_id