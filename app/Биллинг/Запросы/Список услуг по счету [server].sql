/**
 * @author minya92
 * @name qServiceListByAccountServer
 */ 
Select * ,
case 
    when t.end_date is not null
    then true    
    else false
end as modifyd
From bill_services_accounts t1
 Inner Join bill_item_cost t on t1.service_cost_id = t.bill_item_cost_id
 Inner Join bill_services t2 on t.service_id = t2.bill_services_id
 Where :account_id = t1.account_id and (:service_id = t2.bill_services_id or :service_id is null)