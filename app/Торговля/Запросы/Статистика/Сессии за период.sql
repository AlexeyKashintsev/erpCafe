/**
 * 
 * @author Алексей
 * @name qSessionsInPeriod
 */
select * 
From org_session t1
 Where (:start_date <= t1.end_date or t1.end_date is null)
 and :end_date >= t1.start_date
 and (:trade_point = t1.trade_point or :trade_point is null)