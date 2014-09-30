/**
 * 
 * @author minya92
 * @name qDelBillCost
 * @manual
 * @public
 */
Delete 
From bill_item_cost
Where (bill_item_cost.item_cost is null and bill_item_cost.item_id = :item_id)