/**
 *
 * @author Alexey
 * @name qBillById
 */ 
Select * 
From ord_bills t1
 Where :bill_id = t1.ord_bills_id
 or :bill_num = t1.bill_num