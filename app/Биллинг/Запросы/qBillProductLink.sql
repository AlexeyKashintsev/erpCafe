/**
 * @author minya92
 * @name qBillProductLink
 */ 
Select * 
From bill_product_links t1
 Where (:link_id = t1.bill_product_links_id or :link_id is null)
 and   (:account_id = t1.account_id or account_id is null)