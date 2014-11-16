/**
 *
 * @author Work
 * @name qGetPersonalDataOfAllClients
 * @manual TODO Ахтунг здесь все тормозило!!!
 */ 
Select t1.client_id, t1.usr_name, t1.first_name, t1.reg_date, t1.address, t1.bonus_category, t1.phone, tc.client_id as bill_client_id
From client_personal_data t1
left join bill_accounts tc on tc.client_id = t1.client_id 
where tc.bill_accounts_id is null