/**
 * 
 * @author minya92
 * @name qDeleteBillAccount
 * @public
 * @manual
 */
UPDATE bill_accounts
SET active = false
WHERE :account_id = bill_accounts_id