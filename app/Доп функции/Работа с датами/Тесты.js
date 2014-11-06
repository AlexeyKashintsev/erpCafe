/** Тесты для функций работы с датами
 * 
 * @author ml
 * @name Тесты
 */

function DatesTest() {


var self = this;


var datesUtils = new DatesUtils();

// ============ SERVICE FUNCTIONS ===============================================
var results = {
    total: 0,
    bad: 0
};

function test(testDesc, res, expected) {
    results.total++;    
    if (res != expected) {
        results.bad++;
        Logger.info(testDesc +" => еxpected [" + expected + "], but was [" + res + "]");
    }
}

var printResults = function(){
    var msg = "Tests passed."
    if (results.bad > 0)
        msg = 'Tests failed.';
    msg += " Total: " + results.total + ", bad: " + results.bad;
    Logger.info(msg);
};


//=============== TEST FUNCTIONS ===============================================

// currentDateTime
test("currentDateTime() возвращает не-null значение", datesUtils.currentDateTime() != null, true);

// currentDate
test("currentDate() возвращает не-null значение", datesUtils.currentDate() != null, true);

// currentTime
test("currentTime() возвращает не-null значение", datesUtils.currentTime() != null, true);

// incDay
test("incDay(): параметр aDate равен null", datesUtils.incDay(null, 2), null);
test("incDay(): параметр daysAmount пропущен", datesUtils.incDay(new Date(2013, 1, 1)).valueOf(), (new Date(2013, 1, 1)).valueOf());
test("incDay(): функция вызвана без параметров", datesUtils.incDay(), null);
test("incDay(): увеличить дату на 0 дней", datesUtils.incDay(new Date(2013, 1, 1), 0).valueOf(), (new Date(2013, 1, 1)).valueOf());
test("incDay(): увеличить дату на 1 день", datesUtils.incDay(new Date(2013, 1, 1), 1).valueOf(), (new Date(2013, 1, 2)).valueOf());
test("incDay(): увеличить дату на 1 день с переходом на следующий месяц", datesUtils.incDay(new Date(2013, 0, 31), 1).valueOf(), (new Date(2013, 1, 1)).valueOf());
test("incDay(): увеличить дату на 1 день с переходом на следующий год", datesUtils.incDay(new Date(2012, 11, 31), 1).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("incDay(): увеличить дату на 32 дня", datesUtils.incDay(new Date(2013, 1, 1), 32).valueOf(), (new Date(2013, 2, 5)).valueOf());
test("incDay(): уменьшить дату на 1 день", datesUtils.incDay(new Date(2013, 1, 3), -1).valueOf(), (new Date(2013, 1, 2)).valueOf());
test("incDay(): уменьшить дату на 1 день с переходом на предыдущий месяц", datesUtils.incDay(new Date(2013, 1, 1), -1).valueOf(), (new Date(2013, 0, 31)).valueOf());
test("incDay(): уменьшить дату на 1 день с переходом на предыдущий год", datesUtils.incDay(new Date(2013, 0, 1), -1).valueOf(), (new Date(2012, 11, 31)).valueOf());
test("incDay(): уменьшить дату на 32 дня", datesUtils.incDay(new Date(2013, 1, 1), -32).valueOf(), (new Date(2012, 11, 31)).valueOf());

// incHour
test("incHour(): параметр aDate равен null", datesUtils.incHour(null, 2), null);
test("incHour(): параметр hoursAmount пропущен", datesUtils.incHour(new Date(2013, 1, 1)).valueOf(), (new Date(2013, 1, 1)).valueOf());
test("incHour(): функция вызвана без параметров", datesUtils.incHour(), null);
test("incHour(): увеличить на 0 часов", datesUtils.incHour(new Date(2013, 1, 1, 1), 0).valueOf(), (new Date(2013, 1, 1, 1)).valueOf());
test("incHour(): увеличить на 1 час", datesUtils.incHour(new Date(2013, 1, 1, 23, 59, 59, 999), 1).valueOf(), (new Date(2013, 1, 2, 0, 59, 59, 999)).valueOf());
test("incHour(): увеличить на 1 час с переходом на следующий месяц", datesUtils.incHour(new Date(2013, 0, 31, 23), 1).valueOf(), (new Date(2013, 1, 1, 0)).valueOf());
test("incHour(): увеличить на 1 час с переходом на следующий год", datesUtils.incHour(new Date(2012, 11, 31, 23), 1).valueOf(), (new Date(2013, 0, 1, 0)).valueOf());
test("incHour(): увеличить на 1.5 часа", datesUtils.incHour(new Date(2013, 1, 1, 23, 59, 59, 999), 1.5).valueOf(), (new Date(2013, 1, 2, 0, 59, 59, 999)).valueOf());
test("incHour(): увеличить на 24 часа", datesUtils.incHour(new Date(2013, 1, 1), 24).valueOf(), (new Date(2013, 1, 2)).valueOf());
test("incHour(): увеличить на 25 часов", datesUtils.incHour(new Date(2013, 1, 1, 23, 59, 59, 999), 25).valueOf(), (new Date(2013, 1, 3, 0, 59, 59, 999)).valueOf());
test("incHour(): уменьшить на 1 час", datesUtils.incHour(new Date(2013, 0, 31, 0, 59, 59, 999), -1).valueOf(), (new Date(2013, 0, 30, 23, 59, 59, 999)).valueOf());
test("incHour(): уменьшить на 1 час с переходом на предыдущий месяц", datesUtils.incHour(new Date(2013, 1, 1, 0), -1).valueOf(), (new Date(2013, 0, 31, 23)).valueOf());
test("incHour(): уменьшить на 1 час с переходом на предыдущий год", datesUtils.incHour(new Date(2013, 0, 1), -1).valueOf(), (new Date(2012, 11, 31, 23)).valueOf());
test("incHour(): уменьшить на 1.5 часа", datesUtils.incHour(new Date(2013, 0, 1), -1.5).valueOf(), (new Date(2012, 11, 31, 23)).valueOf());
test("incHour(): уменьшить на 24 часа", datesUtils.incHour(new Date(2013, 1, 1), -24).valueOf(), (new Date(2013, 0, 31)).valueOf());
test("incHour(): уменьшить на 25 часов", datesUtils.incHour(new Date(2013, 1, 1, 0, 59, 59, 999), -25).valueOf(), (new Date(2013, 0, 30, 23, 59, 59, 999)).valueOf());

// incMinute
test("incMinute(): параметр aDate равен null", datesUtils.incMinute(null, 2), null);
test("incMinute(): параметр minutesAmount пропущен", datesUtils.incMinute(new Date(2013, 1, 1, 12, 34, 56, 789)).valueOf(), (new Date(2013, 1, 1, 12, 34, 56, 789)).valueOf());
test("incMinute(): функция вызвана без параметров", datesUtils.incMinute(), null);
test("incMinute(): увеличить на 0 минут", datesUtils.incMinute(new Date(2013, 1, 1, 12, 34, 56, 789), 0).valueOf(), (new Date(2013, 1, 1, 12, 34, 56, 789)).valueOf());
test("incMinute(): увеличить на 1 минуту с переходом на следующий час", datesUtils.incMinute(new Date(2013, 1, 1, 12, 59, 56, 789), 1).valueOf(), (new Date(2013, 1, 1, 13, 0, 56, 789)).valueOf());
test("incMinute(): увеличить на 1 минуту с переходом на следующий день", datesUtils.incMinute(new Date(2013, 1, 1, 23, 59, 56, 789), 1).valueOf(), (new Date(2013, 1, 2, 0, 0, 56, 789)).valueOf());
test("incMinute(): увеличить на 1 минуту с переходом на следующий год", datesUtils.incMinute(new Date(2012, 11, 31, 23, 59, 56, 789), 1).valueOf(), (new Date(2013, 0, 1, 0, 0, 56, 789)).valueOf());
test("incMinute(): увеличить на 1.5 минуты с переходом на следующий час", datesUtils.incMinute(new Date(2013, 1, 1, 12, 59, 56, 789), 1).valueOf(), (new Date(2013, 1, 1, 13, 0, 56, 789)).valueOf());
test("incMinute(): увеличить на 60 минут", datesUtils.incMinute(new Date(2013, 1, 1), 60).valueOf(), (new Date(2013, 1, 1, 1)).valueOf());
test("incMinute(): увеличить на 61 минуту", datesUtils.incMinute(new Date(2013, 1, 1, 23, 59, 59, 999), 61).valueOf(), (new Date(2013, 1, 2, 1, 0, 59, 999)).valueOf());
test("incMinute(): уменьшить на 1 минуту с переходом на предыдущий час", datesUtils.incMinute(new Date(2013, 1, 1, 13, 0, 56, 789), -1).valueOf(), (new Date(2013, 1, 1, 12, 59, 56, 789)).valueOf());
test("incMinute(): уменьшить на 1 минуту с переходом на предыдущий день", datesUtils.incMinute(new Date(2013, 1, 1, 0, 0, 56, 789), -1).valueOf(), (new Date(2013, 0, 31, 23, 59, 56, 789)).valueOf());
test("incMinute(): уменьшить на 1 минуту с переходом на предыдущий год", datesUtils.incMinute(new Date(2013, 0, 1, 0, 0, 56, 789), -1).valueOf(), (new Date(2012, 11, 31, 23, 59, 56, 789)).valueOf());
test("incMinute(): уменьшить на 1.5 минуты с переходом на предыдущий час", datesUtils.incMinute(new Date(2013, 1, 1, 13, 0, 56, 789), -1).valueOf(), (new Date(2013, 1, 1, 12, 59, 56, 789)).valueOf());
test("incMinute(): уменьшить на 60 минут", datesUtils.incMinute(new Date(2013, 1, 1), -60).valueOf(), (new Date(2013, 0, 31, 23)).valueOf());
test("incMinute(): уменьшить на 61 минуту", datesUtils.incMinute(new Date(2013, 1, 1, 0, 0, 59, 999), -61).valueOf(), (new Date(2013, 0, 31, 22, 59, 59, 999)).valueOf());

// incSecond
test("incSecond(): параметр aDate равен null", datesUtils.incSecond(null, 2), null);
test("incSecond(): параметр secondsAmount пропущен", datesUtils.incSecond(new Date(2013, 1, 1, 12, 34, 56, 789)).valueOf(), (new Date(2013, 1, 1, 12, 34, 56, 789)).valueOf());
test("incSecond(): функция вызвана без параметров", datesUtils.incSecond(), null);
test("incSecond(): увеличить на 0 секунд", datesUtils.incSecond(new Date(2013, 1, 1, 12, 34, 56, 789), 0).valueOf(), (new Date(2013, 1, 1, 12, 34, 56, 789)).valueOf());
test("incSecond(): увеличить на 1 секунду с переходом на следующую минуту", datesUtils.incSecond(new Date(2013, 1, 1, 12, 34, 59, 789), 1).valueOf(), (new Date(2013, 1, 1, 12, 35, 0, 789)).valueOf());
test("incSecond(): увеличить на 1 секунду с переходом на следующий час", datesUtils.incSecond(new Date(2013, 1, 1, 12, 59, 59, 789), 1).valueOf(), (new Date(2013, 1, 1, 13, 0, 0, 789)).valueOf());
test("incSecond(): увеличить на 1 секунду с переходом на следующий день", datesUtils.incSecond(new Date(2013, 1, 1, 23, 59, 59, 789), 1).valueOf(), (new Date(2013, 1, 2, 0, 0, 0, 789)).valueOf());
test("incSecond(): увеличить на 1 секунду с переходом на следующий год", datesUtils.incSecond(new Date(2012, 11, 31, 23, 59, 59, 789), 1).valueOf(), (new Date(2013, 0, 1, 0, 0, 0, 789)).valueOf());
test("incSecond(): увеличить на 1.5 секунды с переходом на следующую минуту", datesUtils.incSecond(new Date(2013, 1, 1, 12, 34, 59, 789), 1).valueOf(), (new Date(2013, 1, 1, 12, 35, 0, 789)).valueOf());
test("incSecond(): увеличить на 60 секунд", datesUtils.incSecond(new Date(2013, 1, 1), 60).valueOf(), (new Date(2013, 1, 1, 0, 1)).valueOf());
test("incSecond(): увеличить на 61 секунду", datesUtils.incSecond(new Date(2013, 1, 1, 23, 59, 59, 999), 61).valueOf(), (new Date(2013, 1, 2, 0, 1, 0, 999)).valueOf());
test("incSecond(): уменьшить на 1 секунду с переходом на предыдущую минуту", datesUtils.incSecond(new Date(2013, 1, 1, 12, 34, 0, 789), -1).valueOf(), (new Date(2013, 1, 1, 12, 33, 59, 789)).valueOf());
test("incSecond(): уменьшить на 1 секунду с переходом на предыдущий час", datesUtils.incSecond(new Date(2013, 1, 1, 13, 00, 00, 789), -1).valueOf(), (new Date(2013, 1, 1, 12, 59, 59, 789)).valueOf());
test("incSecond(): уменьшить на 1 секунду с переходом на предыдущий день", datesUtils.incSecond(new Date(2013, 1, 2, 0, 0, 0, 789), -1).valueOf(), (new Date(2013, 1, 1, 23, 59, 59, 789)).valueOf());
test("incSecond(): уменьшить на 1 секунду с переходом на предыдущий год", datesUtils.incSecond(new Date(2013, 0, 1, 0, 0, 0, 789), -1).valueOf(), (new Date(2012, 11, 31, 23, 59, 59, 789)).valueOf());
test("incSecond(): уменьшить на 1.5 секунды с переходом на предыдущую минуту", datesUtils.incSecond(new Date(2013, 1, 1, 12, 34, 0, 789), -1).valueOf(), (new Date(2013, 1, 1, 12, 33, 59, 789)).valueOf());
test("incSecond(): уменьшить на 60 секунд", datesUtils.incSecond(new Date(2013, 1, 1), -60).valueOf(), (new Date(2013, 0, 31, 23, 59)).valueOf());
test("incSecond(): уменьшить на 61 секунду", datesUtils.incSecond(new Date(2013, 1, 1, 0, 0, 0, 999), -61).valueOf(), (new Date(2013, 0, 31, 23, 58, 59, 999)).valueOf());

// incMonth
test("incMonth(): параметр aDate равен null", datesUtils.incMonth(null, 2), null);
test("incMonth(): параметр monthsAmount пропущен", datesUtils.incMonth(new Date(2013, 1, 1)).valueOf(), (new Date(2013, 1, 1)).valueOf());
test("incMonth(): функция вызвана без параметров", datesUtils.incMonth(), null);
test("incMonth(): увеличить на 0 месяцев", datesUtils.incMonth(new Date(2013, 1, 1), 0).valueOf(), (new Date(2013, 1, 1)).valueOf());
test("incMonth(): увеличить на 1 месяц", datesUtils.incMonth(new Date(2013, 1, 1), 1).valueOf(), (new Date(2013, 2, 1)).valueOf());
test("incMonth(): увеличить на 1 месяц, день не совпадает", datesUtils.incMonth(new Date(2013, 0, 31), 1).valueOf(), (new Date(2013, 1, 28)).valueOf());
test("incMonth(): увеличить на 1 месяц, день не совпадает, високосный год", datesUtils.incMonth(new Date(2012, 0, 31), 1).valueOf(), (new Date(2012, 1, 29)).valueOf());
test("incMonth(): увеличить на 1 месяц с переходом на следующий год", datesUtils.incMonth(new Date(2012, 11, 31), 1).valueOf(), (new Date(2013, 0, 31)).valueOf());
test("incMonth(): увеличить на 12 месяцев", datesUtils.incMonth(new Date(2012, 1, 29), 12).valueOf(), (new Date(2013, 1, 28)).valueOf());
test("incMonth(): увеличить на 13 месяцев", datesUtils.incMonth(new Date(2012, 1, 29), 13).valueOf(), (new Date(2013, 2, 29)).valueOf());
test("incMonth(): уменьшить на 1 месяц", datesUtils.incMonth(new Date(2013, 1, 1), -1).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("incMonth(): уменьшить на 1 месяц, день не совпадает", datesUtils.incMonth(new Date(2013, 2, 30), -1).valueOf(), (new Date(2013, 1, 28)).valueOf());
test("incMonth(): уменьшить на 1 месяц, день не совпадает, високосный год", datesUtils.incMonth(new Date(2012, 2, 30), -1).valueOf(), (new Date(2012, 1, 29)).valueOf());
test("incMonth(): уменьшить на 1 месяц с переходом на предыдущий год", datesUtils.incMonth(new Date(2013, 0, 31), -1).valueOf(), (new Date(2012, 11, 31)).valueOf());
test("incMonth(): уменьшить на 12 месяцев", datesUtils.incMonth(new Date(2012, 1, 29), -12).valueOf(), (new Date(2011, 1, 28)).valueOf());
test("incMonth(): уменьшить на 13 месяцев", datesUtils.incMonth(new Date(2012, 1, 29), -13).valueOf(), (new Date(2011, 0, 29)).valueOf());

// incYear
test("incYear(): параметр aDate равен null", datesUtils.incYear(null, 2), null);
test("incYear(): параметр yearsAmount пропущен", datesUtils.incYear(new Date(2013, 1, 1)).valueOf(), (new Date(2013, 1, 1)).valueOf());
test("incYear(): функция вызвана без параметров", datesUtils.incYear(), null);
test("incYear(): увеличить на 0 лет", datesUtils.incYear(new Date(2013, 1, 1), 0).valueOf(), (new Date(2013, 1, 1)).valueOf());
test("incYear(): увеличить на 1 год", datesUtils.incYear(new Date(2012, 0, 1), 1).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("incYear(): увеличить на 1 год дату из високосного года", datesUtils.incYear(new Date(2012, 1, 29), 1).valueOf(), (new Date(2013, 1, 28)).valueOf());
test("incYear(): увеличить на 4 года дату из високосного года", datesUtils.incYear(new Date(2012, 1, 29), 4).valueOf(), (new Date(2016, 1, 29)).valueOf());
test("incYear(): уменьшить на 1 год", datesUtils.incYear(new Date(2013, 0, 1), -1).valueOf(), (new Date(2012, 0, 1)).valueOf());
test("incYear(): уменьшить на 1 год дату из високосного года", datesUtils.incYear(new Date(2012, 1, 29), -1).valueOf(), (new Date(2011, 1, 28)).valueOf());
test("incYear(): уменьшить на 4 года дату из високосного года", datesUtils.incYear(new Date(2012, 1, 29), -4).valueOf(), (new Date(2008, 1, 29)).valueOf());

// daysBetween
test("daysBetween(): параметр aBegDate равен null", datesUtils.daysBetween(null, new Date(2013, 1, 5, 11, 6, 3, 9)), null);
test("daysBetween(): параметр aEndDate равен null", datesUtils.daysBetween(new Date(2013, 1, 5, 11, 6, 3, 9)), null);
test("daysBetween(): функция вызвана без параметров", datesUtils.daysBetween(), null);
test("daysBetween(): aBegDate < aEndDate ", datesUtils.daysBetween(new Date(2013, 1, 1, 12, 34, 56, 789), new Date(2013, 1, 5, 11, 6, 3, 9)), 4);
test("daysBetween(): aBegDate > aEndDate ", datesUtils.daysBetween(new Date(2013, 1, 5, 11, 6, 3, 9), new Date(2013, 1, 1, 12, 34, 56, 789)), -4);
test("daysBetween(): aBegDate == aEndDate, одинаковое время ", datesUtils.daysBetween(new Date(2013, 1, 5, 11, 6, 3, 9), new Date(2013, 1, 5, 11, 6, 3, 9)), 0);
test("daysBetween(): aBegDate == aEndDate, разное время ", datesUtils.daysBetween(new Date(2013, 1, 5, 11, 6, 3, 9), new Date(2013, 1, 5, 5, 11, 33, 454)), 0);

// timeBetween
test("timeBetween(): параметр aBegDate равен null", datesUtils.timeBetween(null, new Date(2013, 1, 5, 11, 6, 3, 9)), null);
test("timeBetween(): параметр aEndDate равен null", datesUtils.timeBetween(new Date(2013, 1, 5, 11, 6, 3, 9)), null);
test("timeBetween(): функция вызвана без параметров", datesUtils.timeBetween(), null);

test("timeBetween(): aBegDate < aEndDate ", datesUtils.timeBetween(new Date(2013, 1, 1, 12, 34, 56, 789), new Date(2013, 1, 5, 11, 6, 3, 9)), 340266220);
test("timeBetween(): aBegDate > aEndDate ", datesUtils.timeBetween(new Date(2013, 1, 5, 11, 6, 3, 9), new Date(2013, 1, 1, 12, 34, 56, 789)), -340266220);
test("timeBetween(): aBegDate == aEndDate", datesUtils.timeBetween(new Date(2013, 1, 5, 11, 6, 3, 9), new Date(2013, 1, 5, 11, 6, 3, 9)), 0);

// isLeapYear
test("isLeapYear(): функция вызвана без параметра", datesUtils.isLeapYear(), null);
test("isLeapYear(): невисокосный год", datesUtils.isLeapYear(2013), false);
test("isLeapYear(): високосный год, не делится на 100 без остатка", datesUtils.isLeapYear(2012), true);
test("isLeapYear(): високосный год, делится на 100 без остатка, не делится на 400 без остатка,", datesUtils.isLeapYear(2100), false);
test("isLeapYear(): високосный год, делится на 100 без остатка, делится на 400 без остатка,", datesUtils.isLeapYear(2000), true);

// daysInYear
test("daysInYear(): функция вызвана без параметра", datesUtils.daysInYear(), null);
test("daysInYear(): невисокосный год", datesUtils.daysInYear(new Date(2013, 0, 1)), 365);
test("daysInYear(): високосный год", datesUtils.daysInYear(new Date(2012, 0, 1)), 366);

// daysInMonth
test("daysInMonth(): функция вызвана без параметра", datesUtils.daysInMonth(), null);
test("daysInMonth(): невисокосный год, январь", datesUtils.daysInMonth(new Date(2013, 0, 1)), 31);
test("daysInMonth(): невисокосный год, февраль", datesUtils.daysInMonth(new Date(2013, 1, 1)), 28);
test("daysInMonth(): невисокосный год, март", datesUtils.daysInMonth(new Date(2013, 2, 1)), 31);
test("daysInMonth(): невисокосный год, апрель", datesUtils.daysInMonth(new Date(2013, 3, 1)), 30);
test("daysInMonth(): невисокосный год, май", datesUtils.daysInMonth(new Date(2013, 4, 1)), 31);
test("daysInMonth(): невисокосный год, июнь", datesUtils.daysInMonth(new Date(2013, 5, 1)), 30);
test("daysInMonth(): невисокосный год, июль", datesUtils.daysInMonth(new Date(2013, 6, 1)), 31);
test("daysInMonth(): невисокосный год, август", datesUtils.daysInMonth(new Date(2013, 7, 1)), 31);
test("daysInMonth(): невисокосный год, сентябрь", datesUtils.daysInMonth(new Date(2013, 8, 1)), 30);
test("daysInMonth(): невисокосный год, октябрь", datesUtils.daysInMonth(new Date(2013, 9, 1)), 31);
test("daysInMonth(): невисокосный год, ноябрь", datesUtils.daysInMonth(new Date(2013, 10, 1)), 30);
test("daysInMonth(): невисокосный год, декабрь", datesUtils.daysInMonth(new Date(2013, 11, 1)), 31);
test("daysInMonth(): високосный год, февраль", datesUtils.daysInMonth(new Date(2012, 1, 1)), 29);

// beginOfDay
test("beginOfDay(): функция вызвана без параметра", datesUtils.beginOfDay(), null);
test("beginOfDay(): дата со временем", datesUtils.beginOfDay(new Date(2013, 3, 4, 12, 34, 56, 789)).valueOf(), (new Date(2013, 3, 4)).valueOf());
test("beginOfDay(): дата со нулевым временем", datesUtils.beginOfDay(new Date(2013, 3, 4, 0, 0, 0, 0)).valueOf(), (new Date(2013, 3, 4)).valueOf());

// endOfDay
test("endOfDay(): функция вызвана без параметра", datesUtils.endOfDay(), null);
test("endOfDay(): дата со временем", datesUtils.endOfDay(new Date(2013, 3, 4, 12, 34, 56, 789)).valueOf(), (new Date(2013, 3, 4, 23, 59, 59, 999)).valueOf());

// beginOfWeek
test("beginOfWeek(): функция вызвана без параметра", datesUtils.beginOfWeek(), null);
test("beginOfWeek(): параметр == середина недели", datesUtils.beginOfWeek(new Date(2013, 0, 3, 12, 34, 56, 789)).valueOf(), (new Date(2012, 11, 31)).valueOf());
test("beginOfWeek(): параметр == понедельник", datesUtils.beginOfWeek(new Date(2012, 11, 31, 12, 34, 56, 789)).valueOf(), (new Date(2012, 11, 31)).valueOf());
test("beginOfWeek(): параметр == воскресенье", datesUtils.beginOfWeek(new Date(2013, 0, 6, 12, 34, 56, 789)).valueOf(), (new Date(2012, 11, 31)).valueOf());

// endOfWeek
test("endOfWeek(): функция вызвана без параметра", datesUtils.endOfWeek(), null);
test("endOfWeek(): параметр == середина недели", datesUtils.endOfWeek(new Date(2013, 0, 3, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 6, 23, 59, 59, 999)).valueOf());
test("endOfWeek(): параметр == понедельник", datesUtils.endOfWeek(new Date(2012, 11, 31, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 6, 23, 59, 59, 999)).valueOf());
test("endOfWeek(): параметр == воскресенье", datesUtils.endOfWeek(new Date(2013, 0, 6, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 6, 23, 59, 59, 999)).valueOf());

// beginOfMonth
test("beginOfMonth(): функция вызвана без параметра", datesUtils.beginOfMonth(), null);
test("beginOfMonth(): параметр == середина месяца", datesUtils.beginOfMonth(new Date(2013, 0, 15, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("beginOfMonth(): параметр == начало месяца", datesUtils.beginOfMonth(new Date(2013, 0, 1, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("beginOfMonth(): параметр == конец месяца", datesUtils.beginOfMonth(new Date(2013, 0, 31, 23, 59, 59, 999)).valueOf(), (new Date(2013, 0, 1)).valueOf());

// endOfMonth
test("endOfMonth(): функция вызвана без параметра", datesUtils.endOfMonth(), null);
test("endOfMonth(): параметр == середина месяца", datesUtils.endOfMonth(new Date(2013, 0, 15, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 31, 23, 59, 59, 999)).valueOf());
test("endOfMonth(): параметр == начало месяца", datesUtils.endOfMonth(new Date(2013, 0, 1, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 31, 23, 59, 59, 999)).valueOf());
test("endOfMonth(): параметр == конец месяца", datesUtils.endOfMonth(new Date(2013, 0, 31, 23, 59, 59, 999)).valueOf(), (new Date(2013, 0, 31, 23, 59, 59, 999)).valueOf());

// firstMonthOfQuart
test("firstMonthOfQuart(): функция вызвана без параметра", datesUtils.firstMonthOfQuart(), null);
test("firstMonthOfQuart(): для первого квартала", datesUtils.firstMonthOfQuart(new Date(2013, 1, 31, 12, 34, 56, 789)).valueOf(), 0);
test("firstMonthOfQuart(): для второго квартала", datesUtils.firstMonthOfQuart(new Date(2013, 4, 31, 12, 34, 56, 789)).valueOf(), 3);
test("firstMonthOfQuart(): для третьего квартала", datesUtils.firstMonthOfQuart(new Date(2013, 7, 31, 12, 34, 56, 789)).valueOf(), 6);
test("firstMonthOfQuart(): для четвертого квартала", datesUtils.firstMonthOfQuart(new Date(2013, 10, 31, 12, 34, 56, 789)).valueOf(), 9);

// lastMonthOfQuart
test("lastMonthOfQuart(): функция вызвана без параметра", datesUtils.lastMonthOfQuart(), null);
test("lastMonthOfQuart(): для первого квартала", datesUtils.lastMonthOfQuart(new Date(2013, 1, 31, 12, 34, 56, 789)).valueOf(), 2);
test("lastMonthOfQuart(): для второго квартала", datesUtils.lastMonthOfQuart(new Date(2013, 4, 31, 12, 34, 56, 789)).valueOf(), 5);
test("lastMonthOfQuart(): для третьего квартала", datesUtils.lastMonthOfQuart(new Date(2013, 7, 31, 12, 34, 56, 789)).valueOf(), 8);
test("lastMonthOfQuart(): для четвертого квартала", datesUtils.lastMonthOfQuart(new Date(2013, 10, 31, 12, 34, 56, 789)).valueOf(), 11);

// beginOfQuart
test("beginOfQuart(): функция вызвана без параметра", datesUtils.beginOfQuart(), null);
test("beginOfQuart(): параметр == середина квартала", datesUtils.beginOfQuart(new Date(2013, 1, 14, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("beginOfQuart(): параметр == начало квартала", datesUtils.beginOfQuart(new Date(2013, 0, 1, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("beginOfQuart(): параметр == конец квартала", datesUtils.beginOfQuart(new Date(2013, 2, 31, 23, 59, 59, 999)).valueOf(), (new Date(2013, 0, 1)).valueOf());

// endOfQuart
test("endOfQuart(): функция вызвана без параметра", datesUtils.endOfQuart(), null);
test("endOfQuart(): параметр == середина квартала", datesUtils.endOfQuart(new Date(2013, 1, 14, 12, 34, 56, 789)).valueOf(), (new Date(2013, 2, 31, 23, 59, 59, 999)).valueOf());
test("endOfQuart(): параметр == начало квартала", datesUtils.endOfQuart(new Date(2013, 0, 1, 12, 34, 56, 789)).valueOf(), (new Date(2013, 2, 31, 23, 59, 59, 999)).valueOf());
test("endOfQuart(): параметр == конец квартала", datesUtils.endOfQuart(new Date(2013, 2, 31, 23, 59, 59, 999)).valueOf(), (new Date(2013, 2, 31, 23, 59, 59, 999)).valueOf());

// beginOfYear
test("beginOfYear(): функция вызвана без параметра", datesUtils.beginOfYear(), null);
test("beginOfYear(): параметр == середина года", datesUtils.beginOfYear(new Date(2013, 6, 15, 12, 34, 56, 789)).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("beginOfYear(): параметр == начало года", datesUtils.beginOfYear(new Date(2013, 0, 1)).valueOf(), (new Date(2013, 0, 1)).valueOf());
test("beginOfYear(): параметр == конец года", datesUtils.beginOfYear(new Date(2013, 11, 31, 23, 59, 59, 999)).valueOf(), (new Date(2013, 0, 1)).valueOf());

// endOfYear
test("endOfYear(): функция вызвана без параметра", datesUtils.endOfYear(), null);
test("endOfYear(): параметр == середина года", datesUtils.endOfYear(new Date(2013, 6, 15, 12, 34, 56, 789)).valueOf(), (new Date(2013, 11, 31, 23, 59, 59, 999)).valueOf());
test("endOfYear(): параметр == начало года", datesUtils.endOfYear(new Date(2013, 0, 1)).valueOf(), (new Date(2013, 11, 31, 23, 59, 59, 999)).valueOf());
test("endOfYear(): параметр == конец года", datesUtils.endOfYear(new Date(2013, 11, 31, 23, 59, 59, 999)).valueOf(), (new Date(2013, 11, 31, 23, 59, 59, 999)).valueOf());

// yearOf
test("yearOf(): функция вызвана без параметра", datesUtils.yearOf(), null);
test("yearOf(): ", datesUtils.yearOf(new Date(2013, 11, 31, 23, 59, 59, 999)), 2013);

// quartOf
test("quartOf(): функция вызвана без параметра", datesUtils.quartOf(), null);
test("quartOf(): дата в первом квартале", datesUtils.quartOf(new Date(2013, 1, 1, 23, 59, 59, 999)), 1);
test("quartOf(): дата в втором квартале", datesUtils.quartOf(new Date(2013, 4, 1, 23, 59, 59, 999)), 2);
test("quartOf(): дата в третьем квартале", datesUtils.quartOf(new Date(2013, 7, 1, 23, 59, 59, 999)), 3);
test("quartOf(): дата в четвертом квартале", datesUtils.quartOf(new Date(2013, 10, 1, 23, 59, 59, 999)), 4);

// monthOf
test("monthOf(): функция вызвана без параметра", datesUtils.monthOf(), null);
test("monthOf(): ", datesUtils.monthOf(new Date(2013, 11, 31, 23, 59, 59, 999)), 11);

// dayOf
test("dayOf(): функция вызвана без параметра", datesUtils.dayOf(), null);
test("dayOf(): ", datesUtils.dayOf(new Date(2013, 11, 31, 23, 59, 59, 999)), 31);

// hourOf
test("hourOf(): функция вызвана без параметра", datesUtils.hourOf(), null);
test("hourOf(): ", datesUtils.hourOf(new Date(2013, 11, 31, 23, 59, 59, 999)), 23);

// minuteOf
test("minuteOf(): функция вызвана без параметра", datesUtils.minuteOf(), null);
test("minuteOf(): ", datesUtils.minuteOf(new Date(2013, 11, 31, 23, 59, 59, 999)), 59);

// secondOf
test("secondOf(): функция вызвана без параметра", datesUtils.secondOf(), null);
test("secondOf(): ", datesUtils.secondOf(new Date(2013, 11, 31, 23, 59, 59, 999)), 59);

// millisecondOf
test("millisecondOf(): функция вызвана без параметра", datesUtils.millisecondOf(), null);
test("millisecondOf(): ", datesUtils.millisecondOf(new Date(2013, 11, 31, 23, 59, 59, 999)), 999);

// weekOfYear
test("weekOfYear(): функция вызвана без параметра", datesUtils.weekOfYear(), null);
test("weekOfYear(): дата попадает на 1-ю неделю", datesUtils.weekOfYear(new Date(2013, 0, 1, 23, 59, 59, 999)), 1);
test("weekOfYear(): дата попадает на 1-ю неделю cледующего года", datesUtils.weekOfYear(new Date(2013, 11, 31, 23, 59, 59, 999)), 1);
test("weekOfYear(): дата попадает на 52-ю неделю предыдущего года", datesUtils.weekOfYear(new Date(2012, 0, 1, 23, 59, 59, 999)), 52);
test("weekOfYear(): дата попадает на 9-ю неделю", datesUtils.weekOfYear(new Date(2013, 2, 1, 23, 59, 59, 999)), 9);
test("weekOfYear(): дата попадает на 22-ю неделю", datesUtils.weekOfYear(new Date(2013, 4, 31, 23, 59, 59, 999)), 22);
test("weekOfYear(): дата попадает на 52-ю неделю", datesUtils.weekOfYear(new Date(2013, 11, 29, 23, 59, 59, 999)), 52);

// dayOfYear
test("dayOfYear(): функция вызвана без параметра", datesUtils.dayOfYear(), null);
test("dayOfYear(): 1-й день года", datesUtils.dayOfYear(new Date(2013, 0, 1, 23, 59, 59, 999)), 1);
test("dayOfYear(): 365-й день года", datesUtils.dayOfYear(new Date(2013, 4, 31, 23, 59, 59, 999)), 151);
test("dayOfYear(): 365-й день года", datesUtils.dayOfYear(new Date(2013, 11, 31, 23, 59, 59, 999)), 365);
test("dayOfYear(): 366-й день года", datesUtils.dayOfYear(new Date(2012, 11, 31, 23, 59, 59, 999)), 366);

// dayOfWeek
test("dayOfWeek(): функция вызвана без параметра", datesUtils.dayOfWeek(), null);
test("dayOfWeek(): первый день недели", datesUtils.dayOfWeek(new Date(2013, 4, 27, 23, 59, 59, 999)), 1);
test("dayOfWeek(): последний день недели", datesUtils.dayOfWeek(new Date(2013, 5, 2, 23, 59, 59, 999)), 7);

// dateTimeToString
test("dateTimeToString(): функция вызвана без параметра", datesUtils.dateTimeToString(), null);
test("dateTimeToString(): дата со временем с ведущими нулями", datesUtils.dateTimeToString(new Date(2013, 5, 3, 2, 4, 6)), "03.06.2013 02:04:06");
test("dateTimeToString(): дата со временем без ведущих нулей", datesUtils.dateTimeToString(new Date(2013, 10, 13, 12, 34, 56)), "13.11.2013 12:34:56");

// dateTimeWithMillisToString
test("dateTimeWithMillisToString(): функция вызвана без параметра", datesUtils.dateTimeWithMillisToString(), null);
test("dateTimeWithMillisToString(): дата со временем с ведущими нулями", datesUtils.dateTimeWithMillisToString(new Date(2013, 5, 3, 2, 4, 6, 678)), "03.06.2013 02:04:06:678");
test("dateTimeWithMillisToString(): дата со временем без ведущих нулей", datesUtils.dateTimeWithMillisToString(new Date(2013, 10, 13, 12, 34, 56, 789)), "13.11.2013 12:34:56:789");



// dateToString
test("dateToString(): функция вызвана без параметра", datesUtils.dateToString(), null);
test("dateToString(): дата со временем с ведущими нулями", datesUtils.dateToString(new Date(2013, 5, 3)), "03.06.2013");
test("dateToString(): дата со временем без ведущих нулей", datesUtils.dateToString(new Date(2013, 10, 13)), "13.11.2013");

// monthToString
test("monthToString(): функция вызвана без параметра", datesUtils.monthToString(), null);
test("monthToString(): дата с ведущими нулями", datesUtils.monthToString(new Date(2013, 5, 3)), "06.2013");
test("monthToString(): дата без ведущих нулей", datesUtils.monthToString(new Date(2013, 10, 13)), "11.2013");

// timeToString
test("timeToString(): функция вызвана без параметра", datesUtils.timeToString(), null);
test("timeToString(): дата со временем с ведущими нулями", datesUtils.timeToString(new Date(2013, 5, 3, 2, 4, 6)), "02:04:06");
test("timeToString(): дата со временем без ведущих нулей", datesUtils.timeToString(new Date(2013, 10, 13, 12, 34, 56)), "12:34:56");

// date
test("date(): функция вызвана без параметров", datesUtils.date(), null);
test("date(): функция вызвана без параметра 'год'", datesUtils.date(null, 10, 13, 12, 34, 56), null);
test("date(): параметр 'год' < 0", datesUtils.date(-2013, 10, 13, 12, 34, 56), null);
test("date(): функция вызвана без параметра 'месяц'", datesUtils.date(2013, null, 13, 12, 34, 56), null);
test("date(): параметр 'месяц' < 0", datesUtils.date(2013, -10, 13, 12, 34, 56), null);
test("date(): параметр 'месяц' вне границ опеределенного диапазона(0)", datesUtils.date(2013, 0, 13, 12, 34, 56), null);
test("date(): параметр 'месяц' вне границ опеределенного диапазона(15)", datesUtils.date(2013, 15, 13, 12, 34, 56), null);
test("date(): функция вызвана без параметра 'день'", datesUtils.date(2013, 10, null, 12, 34, 56), null);
test("date(): параметр 'день' < 0", datesUtils.date(2013, 10, -3, 12, 34, 56), null);
test("date(): параметр 'день'  вне границ опеределенного диапазона(0)", datesUtils.date(2013, 10, 0, 12, 34, 56), null);
test("date(): параметр 'день'  вне границ опеределенного диапазона(32)", datesUtils.date(2013, 10, 32, 12, 34, 56), null);
test("date(): неправильные параметры времени", datesUtils.date(2013, 10, 13, 25, 78, 90).valueOf(), (new Date(2013, 10, 13)).valueOf());

// unpreciseDateTime
test("unpreciseDateTime(): функция вызвана без параметра", datesUtils.unpreciseDateTime(), null);
test("unpreciseDateTime()", datesUtils.unpreciseDateTime(new Date(2013, 10, 13, 12, 34, 56, 789)).valueOf(), (new Date(2013, 10, 13, 12, 34, 56)).valueOf());

// amountDescription

// calcNightPeriod

// beginOfNight
test("beginOfNight(): функция вызвана без параметра", datesUtils.beginOfNight(), null);
test("beginOfNight(): h < 22, текущие сутки (21:59:59:999)", datesUtils.beginOfNight(new Date(2013, 10, 13, 21, 59, 59, 999)).valueOf(), (new Date(2013, 10, 12, 22)).valueOf());
test("beginOfNight(): h < 22, следующие сутки (03:59:59:999)", datesUtils.beginOfNight(new Date(2013, 10, 13, 3, 59, 59, 999)).valueOf(), (new Date(2013, 10, 12, 22)).valueOf());
test("beginOfNight(): h == 22", datesUtils.beginOfNight(new Date(2013, 10, 13, 22)).valueOf(), (new Date(2013, 10, 13, 22)).valueOf());
test("beginOfNight(): h > 22", datesUtils.beginOfNight(new Date(2013, 10, 13, 23)).valueOf(), (new Date(2013, 10, 13, 22)).valueOf());

// endOfNight
test("endOfNight(): функция вызвана без параметра", datesUtils.endOfNight(), null);
test("endOfNight(): h < 22, текущие сутки (21:59:59:999)", datesUtils.endOfNight(new Date(2013, 10, 13, 21, 59, 59, 999)).valueOf(), (new Date(2013, 10, 13, 6)).valueOf());
test("endOfNight(): h < 22, следующие сутки (03:59:59:999)", datesUtils.endOfNight(new Date(2013, 10, 13, 3, 59, 59, 999)).valueOf(), (new Date(2013, 10, 13, 6)).valueOf());
test("endOfNight(): h == 22", datesUtils.endOfNight(new Date(2013, 10, 13, 22)).valueOf(), (new Date(2013, 10, 14, 6)).valueOf());
test("endOfNight(): h > 22", datesUtils.endOfNight(new Date(2013, 10, 13, 23)).valueOf(), (new Date(2013, 10, 14, 6)).valueOf());

// equal
test("equal(): функция вызвана без параметров", datesUtils.equal(), null);
test("equal(): aDate1 is null", datesUtils.equal(null, new Date(2013, 10, 13)), null);
test("equal(): aDate2 is null", datesUtils.equal(new Date(2013, 10, 13)), null);
test("equal(): даты одинаковы", datesUtils.equal(new Date(2013, 10, 13, 12, 34, 56, 789), new Date(2013, 10, 13,  12, 34, 56, 789)), true);
test("equal(): даты не одинаковы", datesUtils.equal(new Date(2013, 10, 13, 12, 34, 56, 788), new Date(2013, 10, 13,  12, 34, 56, 789)), false);

// millisecondsToTimeInterval
test("millisecondsToTimeInterval(): функция вызвана без параметра", datesUtils.millisecondsToTimeInterval(), null);
test("millisecondsToTimeInterval(): 2 часа 35 минут 40 секунд 12 миллисекунд", datesUtils.millisecondsToTimeInterval(9340012), "2:35:40");


printResults();
}