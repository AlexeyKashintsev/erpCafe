/**
 *
 * @author Work
 * @name qGetCities
 * @public
 */ 
Select * 
From org_cities t1
 Where (:city_id = t1.org_cities_id or :city_id is null)