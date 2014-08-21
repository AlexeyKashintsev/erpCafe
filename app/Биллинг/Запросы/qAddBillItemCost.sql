/**
 * 
 * @author minya92
 * @name qAddBillItemCost
 */
INSERT INTO bill_item_cost (bill_item_cost_id,item_id, item_cost, start_date, end_date)
    VALUES (trunc(random() * 99999999 + 10000000), :item_id, :item_cost, now(), :end_date);