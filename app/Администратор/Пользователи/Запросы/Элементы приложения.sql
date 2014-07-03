/**
 * @name 132134455010936
*/
Select * 
From MTD_ENTITIES e
 Where ((:PARENT = e.MDENT_PARENT_ID) or ((:PARENT is null)
 and (e.MDENT_PARENT_ID is null)))
 and ( not (e.MDENT_TYPE in (0, 80)))
 Order by e.MDENT_ORDER asc