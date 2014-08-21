/**
 * 
 * @author Alexey
 * @name accountDetailList
 * @public
 */

select mdent_id as pNumb, null as pName, null as pDef, null as pPrice, null as pCount
    , null as pCost
from mtd_entities t
where t.mdent_id = t.mdent_parent_id