/**
 *
 * @author Work
 * @name qGetClientPhones
 * @manual
 */ 
Select t1.phone 
From client_personal_data t1
 Where ((:city_id is null) or (:city_id = t1.city))
 and t1.phone is not null