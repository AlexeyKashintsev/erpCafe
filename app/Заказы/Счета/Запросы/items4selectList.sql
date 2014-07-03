/**
 * 
 * @author Alexey
 * @name items4selectList
 * @public
 */
select mdent_id as pId, null as pName, null as pDef, null as pPrice
, null as selectable, null as pParent
from mtd_entities t
where t.mdent_id = t.mdent_parent_id