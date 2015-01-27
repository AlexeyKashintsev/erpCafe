/**
 *
 * @author StipJey
 * @name qGetPhoneByFourDigit
 */ 
Select * 
From client_personal_data t1
where phone like '%'||:digits and length(:digits) > 3