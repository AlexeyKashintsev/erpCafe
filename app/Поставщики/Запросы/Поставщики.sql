/**
 *
 * @author Alexey
 * @name qSuppliers
 * @public
 */ 
Select * 
From wh_suppliers t1
where (t1.franchazi_id = :franchazi_id or :franchazi_id is null or t1.franchazi_id is null)
and (t1.franshize_id = :franchize_id or :franchize_id is null or t1.franshize_id is null)