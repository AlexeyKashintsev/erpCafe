/**
 *
 * @author Work
 * @name qGetClientEmail
 * @manual
 */ 
Select t1.client_id, t1.email 
From client_personal_data t1
 Inner Join org_cities t on t.org_cities_id = t1.city
 Where ((:city = t.city and :city_id is null) 
or (:city_id = t1.city and :city is null)
or (:city is null and :city_id is null))
and t1.email is not null