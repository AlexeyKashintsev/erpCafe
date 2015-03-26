/**
 *
 * @author minya92
 * @name qOperationsItems
 * @public
 */ 
Select * 
From bill_operations_items t1
 Inner Join bill_item_cost t on t1.cost_id = t.bill_item_cost_id
 Inner Join items_catalog t2 on t.item_id = t2.items_catalog_id
 Where :operation_id = t1.operation_id or :operation_id is null