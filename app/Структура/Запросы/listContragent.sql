/**
 *
 * @author mike
 * @name listContragent
 */ 
Select * 
From org_contragent t1
 Where :contragent_id = t1.org_contragent_id 
OR :contragent_id is null