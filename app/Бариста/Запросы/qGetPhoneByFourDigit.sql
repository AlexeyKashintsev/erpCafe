/**
 *
 * @author StipJey
 * @name qGetPhoneByFourDigit
 */ 
Select * 
From client_personal_data t1
where phone like '%'||:digits