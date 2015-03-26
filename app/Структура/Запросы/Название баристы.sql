/**
 * @public
 * @readonly
 * @author minya92
 * @name qBaristaName
 */ 
Select barista_name
From org_franchazi t1
 Inner Join org_barista_name t on t1.franchize_id = t.franchize_id
 Where (:franchazi_id = t1.org_franchazi_id or :franchazi_id is null)
 and   (:franshize_id = t.franchize_id or :franshize_id is null)
limit 1