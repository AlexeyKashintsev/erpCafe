/**
 *
 * @author Work
 * @name qGetPersonalDataOfAllClients
 * @manual TODO Ахтунг здесь все тормозило!!!
 */ 
Select *, tc.client_id as bill_client_id
From client_personal_data t1
left join bill_accounts tc on tc.client_id = t1.client_id 
where tc.bill_accounts_id is null