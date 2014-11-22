/**
 * @public
 * @writable cheklist_usage
 * @author minya92
 * @name qCheklistUsage
 */ 
Select * , 
(case 
    when cheklist_id = :checklist_id
    then true     
    else false 
end) as selected,
(case 
    when cheklist_id = :checklist_id
    then true     
    else false 
end) as selected_hidden
From org_trade_point t1
 Left Join cheklist_usage t on t.trade_point_id = t1.org_trade_point_id
 Where :franchazi_id = t1.franchazi_id 
 and (
    ((t.cheklist_id is not null and (t.cheklist_id = :checklist_id)) or t.cheklist_id is null)
 )
