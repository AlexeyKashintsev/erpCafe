/**
 *
 * @author mike
 * @name listFranchazi
 * @public
TODO Продублировать запрос с защитой
 */ 
Select * 
From org_franchazi t1
 Where (:franchazi_id = t1.org_franchazi_id or :franchazi_id is null)