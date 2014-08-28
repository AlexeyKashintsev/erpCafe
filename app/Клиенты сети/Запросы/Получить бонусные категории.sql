/**
 *
 * @author stipjey
 * @name qGetBonusCategories
 * @public
 */ 
Select * 
From client_bonus_category t1
 Where :category_id = t1.client_bonus_category_id