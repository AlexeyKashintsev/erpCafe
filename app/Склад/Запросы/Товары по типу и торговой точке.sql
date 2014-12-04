/**
 * 
 * @author mike
 * @name queryItems
 * @public
 * @readonly
 */
select *,
(case 
    when warehouse = :trade_point_id
    then true     
    else false 
end) as selectItem,
(case 
    when warehouse = :trade_point_id
    then true     
    else false 
end) as selectItemHidden
from
(
    Select t1.wh_items_id, max(t.warehouse) as warehouse, t1.item_name
    , t1.franchazi_id, t1.item_type
    From wh_items t1
     Left Join wh_items_in_warehouse t on t.item_id = t1.wh_items_id
     and :trade_point_id = t.warehouse or t.warehouse is null
     where (:item_type = t1.item_type or :item_type = 0) and
           (:franchazi_id = t1.franchazi_id or franchazi_id is null)
    Group By wh_items_id, item_name, franchazi_id, item_type
) q