/**
 * @readonly
 * @author minya92
 * @name qOperationStatus
 * @public
 */ 
select * from
(Select *
From bill_operations_status t1
union all
Select 0 as bill_operations_status_id, 'Все' as status_name
From bill_operations_status t) q
group by bill_operations_status_id, status_name
order by q.bill_operations_status_id