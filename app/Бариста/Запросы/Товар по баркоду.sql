/**
 * @public
 * @author Work
 * @name qGetItemByBarCode
 */ 
Select * 
From wh_items t1
 Where :barcode = t1.bar_code