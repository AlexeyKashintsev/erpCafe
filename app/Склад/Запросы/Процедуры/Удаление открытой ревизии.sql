/**
 * @public 
 * @manual
 * @author minya92
 * @name qDeleteRevision
 */

Delete from org_session t1
Where :session_id = t1.org_session_id 
and t1.revision = true 
and end_date is null