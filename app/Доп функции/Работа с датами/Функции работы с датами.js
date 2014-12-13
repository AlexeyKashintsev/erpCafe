/** 
 * @public
 * Функции для работы с датами
 * @name DatesUtils
 * @author ml
 * @version 2.0 
 */

function DatesUtils() {
    var self = this, model = this.model;
    /* Прежде чем добавить - поищи! */

//Типы временных интервалов для группировки данных в отчетах. 
//const DAY = 0;
    self.WEEK = 1;
    self.MONTH = 2;
    self.QUARTER = 4;
    self.YEAR = 8;

    var MS_PER_DAY = 1000 * 60 * 60 * 24; // Кол-во миллисекунд в сутках

// Квартал по месяцу ( месяцы в диапазоне 0 - 11)
    var quartByMonth = new Array();
    quartByMonth[0] = quartByMonth[1] = quartByMonth[2] = 1;
    quartByMonth[3] = quartByMonth[4] = quartByMonth[5] = 2;
    quartByMonth[6] = quartByMonth[7] = quartByMonth[8] = 3;
    quartByMonth[9] = quartByMonth[10] = quartByMonth[11] = 4;

// Границы кварталов
    var quartBoundaries = [];
    quartBoundaries[1] = {
        first: 0,
        last: 2
    };
    quartBoundaries[2] = {
        first: 3,
        last: 5
    };
    quartBoundaries[3] = {
        first: 6,
        last: 8
    };
    quartBoundaries[4] = {
        first: 9,
        last: 11
    };


    /** () -> date <br>
     * Возвращает текущую дату и время.
     * @return Текущее значение даты и времени типа date.
     */
    self.currentDateTime = function() {
        return new Date();
    };

    /** () -> date <br>
     * Возвращает текущую дату c обнуленным временем.
     * @return Текущая дата типа date со временем в формате 00:00:00:000
     */
    self.currentDate = function() {
        var dt = new Date();
        dt.setHours(0, 0, 0, 0);
        return dt;
    };

    /** () -> date <br>
     * Возвращает текущую дату-время c "обнуленной" датой.
     * @return Текущая дата-время типа date со значением даты, соответствующим "1 января 1970 года"
     */
    self.currentTime = function()
    {
        var dt = new Date();
        return new Date(1970, 0, 1, dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
    };

    /** (date, number) -> date <br>
     * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество дней <i>daysAmount</i>.
     * При необходимости значения месяца или года изменяются автоматически.
     * @param aDate Параметр типа date, значение которого надо увеличить.
     * @param daysAmount Параметр типа number. Количество дней, на которое увеличивается дата <i>aDate</i>.
     * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
     * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество дней <i>daysAmount</i>. Время остается без изменений.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
     * Если параметр <i>daysAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>. 
     */
    self.incDay = function(aDate, daysAmount)
    {
        if (aDate) {
            if (daysAmount) {
                var dt = new Date(aDate.getTime());
                dt.setDate(dt.getDate() + daysAmount);
                return dt;
            } else
                return aDate;
        }
        return null;
    };

    /** (date, number) -> date <br> 
     * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество часов <i>hoursAmount</i>.
     * При необходимости значения месяца или года изменяются автоматически.
     * @param aDate Параметр типа date, значение которого надо увеличить.
     * @param hoursAmount Параметр типа number. Количество часов, на которое увеличивается дата <i>aDate</i>.
     * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
     * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество часов <i>hoursAmount</i>.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
     * Если параметр <i>hoursAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>.
     */
    self.incHour = function(aDate, hoursAmount)
    {
        if (aDate) {
            if (hoursAmount) {
                var dt = new Date(aDate.getTime());
                dt.setHours(dt.getHours() + hoursAmount);
                return dt;
            } else
                return aDate;
        }
        return null;
    };

    /** (date, number) -> date <br> 
     * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество минут <i>minutesAmount</i>.
     * @param aDate Параметр типа date, значение которого надо увеличить.
     * @param minutesAmount Параметр типа number. Количество минут, на которое увеличивается дата <i>aDate</i>.
     * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
     * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество минут <i>minutesAmount</i>.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
     * Если параметр <i>minutesAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>.
     */
    self.incMinute = function(aDate, minutesAmount)
    {
        if (aDate) {
            if (minutesAmount) {
                var dt = new Date(aDate.getTime());
                dt.setMinutes(dt.getMinutes() + minutesAmount);
                return dt;
            } else
                return aDate;
        }
        return null;
    };

    /** (date, number) -> date <br> 
     * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество секунд <i>secondsAmount</i>.
     * @param aDate Параметр типа date, значение которого надо увеличить.
     * @param secondsAmount Параметр типа number. Количество секунд, на которое увеличивается дата <i>aDate</i>.
     * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
     * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество секунд <i>secondsAmount</i>.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
     * Если параметр <i>secondsAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>.
     */
    self.incSecond = function(aDate, secondsAmount)
    {
        if (aDate) {
            if (secondsAmount) {
                var dt = new Date(aDate.getTime());
                dt.setSeconds(dt.getSeconds() + secondsAmount);
                return dt;
            } else
                return aDate;
        }
        return null;
    };

    /** (date, number) -> date <br> 
     * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество месяцев <i>monthsAmount</i>.
     * @param aDate Параметр типа date, значение которого надо увеличить.
     * @param monthsAmount Параметр типа number. Количество месяцев, на которое увеличивается дата <i>aDate</i>.
     * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
     * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество месяцев <i>monthsAmount</i>. Время остается без изменений.<br>
     * При добавлении месяцев предполагается, что новая дата будет тем же днем месяца, т.е. если, например, месяц прибавлен ко <i>2 января</i> какого-либо года, 
     * то результат должен быть <i>2 февраля</i>. Но если месяц добавлен к <i>31 января</i>, то результатом будет последний день Февраля.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
     * Если параметр <i>monthsAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>.
     */
    self.incMonth = function(aDate, monthsAmount)
    {
        if (aDate) {
            if (monthsAmount) {
                var dt = new Date(aDate.getTime());
                dt.setMonth(dt.getMonth() + monthsAmount);
                if (dt.getDate() < aDate.getDate())
                    dt.setDate(0);
                return dt;
            } else
                return aDate;
        }
        return null;
    };

    /** (date, number) -> date <br> 
     * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество лет <i>yearsAmount</i>.
     * @param aDate Параметр типа date, значение которого надо увеличить.
     * @param yearsAmount Параметр типа number. Количество лет, на которое увеличивается дата <i>aDate</i>.
     * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
     * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество лет <i>yearsAmount</i>. Время остается без изменений.<br>
     * Для согласования неравных длин месяцев или лет выполняется корректировка. Например, результатом прибавления года к <i>29 февраля</i> будет <i>28 февраля</i> следующего года.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
     * Если параметр <i>yearsAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>. 
     */
    self.incYear = function(aDate, yearsAmount)
    {
        if (aDate) {
            if (yearsAmount) {
                var dt = new Date(aDate.getTime());
                dt.setFullYear(dt.getFullYear() + yearsAmount);
                if (aDate.getMonth() < dt.getMonth())
                    dt.setDate(0);
                return dt;
            } else
                return aDate;
        }
        return null;
    };

    /** (date, date) -> number <br>
     * Возвращает <i>целочисленную</i> разницу в днях между двумя датами, переданными параметрами <i>aBegDate</i> и <i>aEndDate</i> типа ДатаВремя.
     * @param aBegDate Параметр типа date. Начальная дата.
     * @param aEndDate Параметр типа date. Конечная дата.
     * @return Число дней между датами.<br>
     * Если <i>aBegDate</i> &lt <i>aEndDate</i>, то возвращается положительное значение.<br>
     * Если <i>aBegDate</i> &gt <i>aEndDate</i>, то возвращается отрицательное значение.<br>
     * Если <i>aBegDate</i> == <i>aEndDate</i>, то возвращается ноль.<br>
     * Если хотя бы один из параметров не задан, возвращается <code>null</code>.
     */
    self.daysBetween = function(aBegDate, aEndDate)
    {
        if (aBegDate && aEndDate) {
            var edt = new Date(aEndDate.getTime());
            edt.setHours(aBegDate.getHours(), aBegDate.getMinutes(), aBegDate.getSeconds(), aBegDate.getMilliseconds());
            return (edt.getTime() - aBegDate.getTime()) / MS_PER_DAY;
        }
        return null;
    };

    /**
     * 
     * @param {Date} aBegDate Начальная дата.
     * @param {Date} aEndDate Конечная дата.
     * @returns {Number|null} Число дней между датами.
     * Если <i>aBegDate</i> &lt <i>aEndDate</i>, то возвращается положительное значение.<br>
     * Если <i>aBegDate</i> &gt <i>aEndDate</i>, то возвращается отрицательное значение.<br>
     * Если <i>aBegDate</i> == <i>aEndDate</i>, то возвращается ноль.<br>
     * Если хотя бы один из параметров не задан, возвращается <code>null</code>.
     */
    self.daysBetweenExactly = function(aBegDate, aEndDate) {
        if (aBegDate && aEndDate) {
            return (aEndDate.getTime() - aBegDate.getTime()) / MS_PER_DAY;
        }
        return null;
    };

    /**  (date, date) -> number <br>
     * Возвращает целочисленную разницу в миллисекундах между двумя датами, переданными параметрами <i>aBegDate</i> и <i>aEndDate</i> типа ДатаВремя.
     * @param aBegDate Параметр типа date. Начальная дата.
     * @param aEndDate Параметр типа date. Конечная дата.
     * @return Число миллисекунд между датами.<br>
     * Если <i>aBegDate</i> &lt <i>aEndDate</i>, то возвращается положительное значение.<br>
     * Если <i>aBegDate</i> &gt <i>aEndDate</i>, то возвращается отрицательное значение.<br>
     * Если <i>aBegDate</i> == <i>aEndDate</i>, то возвращается ноль.<br>
     * Если хотя бы один из параметров не задан, возвращается <code>null</code>.
     */
    self.timeBetween = function(aBegDate, aEndDate)
    {
        if (aBegDate && aEndDate)
            return aEndDate.getTime() - aBegDate.getTime();
        return null;
    };

    /** (number) -> boolean <br>
     * Определяет, является ли год високосным.<br>
     * Год считается високосным только в том случае если он делится на 4 без остатка,
     * но при этом не делится на 100 без остатка, 
     * или, если делится на 100, должен делится и на 400 без остатка.
     * @param aYear Параметр типа date. Значение года типа number в формате YYYY
     * @return Значение типа boolean.<br>
     * <code>true</code> - если год <i>aYear</i> високосный, иначе <code>false</code>.<br>
     * Если значение параметра <i>aYear</i> не определено или не является положительным числом,
     * то возвращается <code>null</code>
     */
    self.isLeapYear = function(aYear)
    {
        if (aYear)
            return (aYear % 4 == 0) && (aYear % 100 != 0 || aYear % 400 == 0);
        return null;
    };

    /** (date) -> number <br>
     * Возвращает число дней в году, на который приходится заданная дата.
     * @param aDate Параметр типа date. Параметр типа date.
     * @return Значение типа number, соответствующее числу дней в году, на который приходится дата <i>aDate</i>.
     */
    self.daysInYear = function(aDate)
    {
        if (aDate) {
            return self.isLeapYear(aDate.getFullYear()) ? 366 : 365;
        }
        return null;
    };

    /** (date) -> number <br> 
     * Возвращает число дней в месяце, на который приходится заданная дата.
     * @param aDate Параметр типа date. Параметр типа date.
     * @return Значение типа number, соответствующее числу дней в месяце, на который приходится дата <i>aDate</i>.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.daysInMonth = function(aDate)
    {
        if (aDate)
            return new Date(aDate.getFullYear(), aDate.getMonth() + 1, 0).getDate();
        return null;
    };

    /** (date) -> date <br> 
     * Возвращает начало дня, соответствующего заданной дате.
     * @param aDate Параметр типа date.
     * @return Значение типа date, соответствующее дате <i>aDate</i> со значением времени, установленным в 00:00:00:000.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.beginOfDay = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setHours(0, 0, 0, 0);
            return dt;
        }
        return null;
    };

    /** (date) -> date <br>
     * Возвращает конец дня, соответствующего заданной дате.
     * @param aDate Параметр типа date.
     * @return Значение типа date, соответствующее дате <i>aDate</i> со значением времени, установленным в 23:59:59:999.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.endOfDay = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setHours(23, 59, 59, 999);
            return dt;
        }
        return null;
    };

    /** (date) -> date <br>
     * Возвращает начало недели (понедельник), на которую приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа date, являющееся первым днем недели, на который приходится дата <i>aDate</i>. Значение времени установлено в 00:00:00:000.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>. 
     */
    self.beginOfWeek = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setHours(0, 0, 0, 0);
            var day = dt.getDay();
            var diff = dt.getDate() - day + (!day ? -6 : 1);
            dt.setDate(diff);
            return dt;
        }
        return null;
    };

    /** (date) -> date <br>
     * Возвращает конец недели, на которую приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа date, являющееся последним днем недели, на который приходится дата <i>aDate</i>. Значение времени установлено в 23:59:59:999.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>. 
     */
    self.endOfWeek = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setHours(23, 59, 59, 999);
            var day = dt.getDay();
            var diff = dt.getDate() + (!day ? day : 7 - day); //!day тоже самое что day == 0
            dt.setDate(diff);
            return dt;
        }
        return null;
    };

    /** (date) -> date <br>
     * Возвращает начало месяца, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа date, являющееся первым днем месяца, на который приходится дата <i>aDate</i>. Значение времени установлено в 00:00:00:000.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.beginOfMonth = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setDate(1);
            return self.beginOfDay(dt);
        }
        return null;
    };

    /** (date) -> date <br>
     * Возвращает конец месяца, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа date, являющееся последним днем месяца, на который приходится дата aDate. Значение времени установлено в 23:59:59:999.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>. 
     */
    self.endOfMonth = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setDate(self.daysInMonth(aDate));
            return self.endOfDay(dt);
        }
        return null;
    };

    /** (date) -> number <br>
     * Возвращает первый месяц квартала, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа number, являющееся номером первого месяца квартала, на который приходится дата <i>aDate</i>.<br>
     * Значение номера месяца находится в пределах от 0 до 11.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>. 
     */
    self.firstMonthOfQuart = function(aDate) {
        if (aDate)
            return quartBoundaries[self.quartOf(aDate)].first;
        return null;
    };

    /** (date) -> number <br>
     * Возвращает последний месяц квартала, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа number, являющееся номером последнего месяца квартала, на который приходится дата <i>aDate</i>.<br>
     * Значение номера месяца находится в пределах от 0 до 11.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>. 
     */
    self.lastMonthOfQuart = function(aDate) {
        if (aDate)
            return quartBoundaries[self.quartOf(aDate)].last;
        return null;
    };

    /** (date) -> date <br>
     * Возвращает начало квартала, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа date, являющееся первым днем квартала, на который приходится дата <i>aDate</i>. Значение времени установлено в 00:00:00:000.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.beginOfQuart = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setMonth(self.firstMonthOfQuart(aDate));
            return self.beginOfMonth(dt);
        }
        return null;
    };

    /** (date) -> date <br>
     * Возвращает конец квартала, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа date, являющееся последним днем кваратала, на который приходится дата aDate. Значение времени установлено в 23:59:59:999.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.endOfQuart = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setMonth(self.lastMonthOfQuart(aDate));
            return self.endOfMonth(dt);
        }
        return null;
    };

    /** (date) -> date
     * Возвращает начало года, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа date, являющееся первым днем года, на который приходится дата <i>aDate</i>. Значение времени установлено в 00:00:00:000.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.beginOfYear = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setMonth(0);
            dt.setDate(1);
            return self.beginOfDay(dt);
        }
        return null;
    };

    /** (date) -> date
     * Возвращает конец года, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа date, являющееся последним днем года, на который приходится дата <i>aDate</i>. Значение времени установлено в 23:59:59:999.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.endOfYear = function(aDate)
    {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setMonth(11);
            dt.setDate(31);
            return self.endOfDay(dt);
        }
        return null;
    };

    /** (date) -> number
     * Возвращает год в формате YYYY, на который приходится заданная дата. 
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее году, на который приходится дата <i>aDate</i>.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.yearOf = function(aDate)
    {
        if (aDate)
            return aDate.getFullYear();
        return null;
    };

    /** (date) -> number <br>
     * Возвращает квартал, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа number, являющееся номером квартала, на который приходится дата <i>aDate</i>.<br>
     * Значение номера квартала находится в диапазоне от 1 до 4.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.quartOf = function(aDate) {
        if (aDate)
            return quartByMonth[aDate.getMonth()];
        return null;
    };

    /** (date) -> number <br>
     * Возвращает месяц, на который приходится заданная дата. 
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее месяцу, на который приходится дата <i>aDate</i>.<br>
     * Значение номера месяца находится в диапазоне от 0 до 11.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.monthOf = function(aDate)
    {
        if (aDate)
            return aDate.getMonth();
        return null;
    };

    /** (date) -> number <br>
     * Возвращает день месяца, на который приходится заданная дата.
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее дню месяца, на который приходится дата <i>aDate</i>.<br>
     * Значение номера дня находится в диапазоне от 1 до 31.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.dayOf = function(aDate)
    {
        if (aDate)
            return aDate.getDate();
        return null;
    };

    /** (date) -> number <br>
     * Возвращает значение часа, определенного заданной датой. 
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее часу дня, на который приходится дата <i>aDate</i>.<br>
     * Значение часов находится в диапазоне от 0 до 23.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.hourOf = function(aDate)
    {
        if (aDate)
            return aDate.getHours();
        return null;
    };


    /** (date) -> number <br>
     * Возвращает значение минуты, определенной заданной датой. 
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее минуте, определенной датой <i>aDate</i>.<br>
     * Значение минут находится в диапазоне от 0 до 59.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.minuteOf = function(aDate)
    {
        if (aDate)
            return aDate.getMinutes();
        return null;
    };

    /** (date) -> number <br>
     * Возвращает значение секунды, определенной заданной датой. 
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее секунде, определенной датой <i>aDate</i>.<br>
     * Значение секунд находится в диапазоне от 0 до 59.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.secondOf = function(aDate)
    {
        if (aDate)
            return aDate.getSeconds();
        return null;
    };

    /** (date) -> number <br>
     * Возвращает значение миллисекунды, определенной заданной датой. 
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее миллисекунде, определенной датой <i>aDate</i>.<br>
     * Значение секунд находится в диапазоне от 0 до 999.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.millisecondOf = function(aDate)
    {
        if (aDate)
            return aDate.getMilliseconds();
        return null;
    };

    /** (date) -> number <br>
     * Возвращает номер недели в году (по ISO), на которую приходится заданная дата. 
     * @see http://en.wikipedia.org/wiki/ISO_week_date
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее номеру недели в году, на которую приходится дата <i>aDate</i>.<br>
     * Значение номеров недели находится в диапазоне от 1 до 52.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.weekOfYear = function(aDate)
    {
        if (aDate) {
            // Copy date so don't modify original
            var dt = new Date(aDate.getTime());
            dt.setHours(0, 0, 0);
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            dt.setDate(dt.getDate() + 4 - (dt.getDay() || 7));
            // Get first day of year
            var yearStart = new Date(dt.getFullYear(), 0, 1);
            // Calculate full weeks to nearest Thursday
            var weekNo = Math.ceil((((dt - yearStart) / MS_PER_DAY) + 1) / 7);
            // Return array of year and week number
            return weekNo;
        }
        return null;
    };

    /** (date) -> number <br>
     * Возвращает номер дня в году, соответствующий заданной дате. 
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее номеру дня в году, на который приходится дата <i>aDate</i>.<br>
     * Значение дней находится в диапазоне от 1 до 366.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.dayOfYear = function(aDate)
    {
        if (aDate) {
            var onejan = self.beginOfYear(aDate);
            return Math.ceil((aDate.getTime() - onejan.getTime()) / MS_PER_DAY);
        }
        return null;
    };

    /** (date) -> number <br>
     * Возвращает номер дня в неделе, на которую приходится заданная дата. 
     * @param aDate Параметр типа date.
     * @return Значение типа number, соответствующее номеру дня в неделе, на которую приходится дата <i>aDate</i>.<br>
     * Значение дней находится в диапазоне от 1 до 7.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.dayOfWeek = function(aDate)
    {
        if (aDate) {
            var num = aDate.getDay();
            return (num) ? num : 7;
        }
        return null;
    };

    var twoDigits = function(num) {
        return (num > 9 ? num : "0" + num);
    };

    /** (date) -> string <br>
     * Возвращает строковое представление заданной даты со временем в формате <i>ДД.ММ.ГГГГ ЧЧ:ММ:СС</i>. 
     * @param aDate Параметр типа date.
     * @return Строковое представление даты <i>aDate</i> со временем.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.dateTimeToString = function(aDate)
    {
        if (aDate)
            return self.dateToString(aDate) + " " + self.timeToString(aDate);
        return null;
    };

    /** (date) -> string <br>
     * Возвращает строковое представление заданной даты со временем в формате <i>ДД.ММ.ГГГГ ЧЧ:ММ:СС:ММММ</i> (с миллисекундами). 
     * @param aDate Параметр типа date.
     * @return Строковое представление даты <i>aDate</i> со временем.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.dateTimeWithMillisToString = function(aDate)
    {
        if (aDate)
            return self.dateToString(aDate) + " " + self.timeToString(aDate) + ":" + self.millisecondOf(aDate);
        return null;
    };

    /** (date) -> string <br>
     * Возвращает строковое представление заданной даты без времени в формате <i>ДД.ММ.ГГГГ</i>
     * @param aDate Параметр типа date.
     * @return Строковое представление даты <i>aDate</i> без времени.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.dateToString = function(aDate)
    {
        if (aDate) {
            var d = aDate.getDate();
            var m = aDate.getMonth() + 1;
            var y = aDate.getFullYear();
            return twoDigits(d) + "." + twoDigits(m) + "." + y;
        }
        return null;
    };

    /** (date) -> string <br>
     * Возвращает строковое представление заданной даты без времени в формате <i>ММ.ГГГГ</i> 
     * @param aDate Параметр типа date.
     * @return Строковое представление даты <i>aDate</i> в формате <i>ММ.ГГГГ</i><br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>. 
     */
    self.monthToString = function(aDate)
    {
        if (aDate) {
            var m = aDate.getMonth() + 1;
            var y = aDate.getFullYear();
            return twoDigits(m) + "." + y;
        }
        return null;
    };

    /** (date) -> string <br>
     * Возвращает строковое представление времени для заданной даты в формате <i>ЧЧ:ММ:СС</i>
     * @param aDate Параметр типа date.
     * @return Строковое представление времени для даты <i>aDate</i>.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.timeToString = function(aDate)
    {
        if (aDate) {
            var h = aDate.getHours();
            var mm = aDate.getMinutes();
            var s = aDate.getSeconds();
            return twoDigits(h) + ":" + twoDigits(mm) + ":" + twoDigits(s);
        }
        return null;
    };
    
    self.timeToShortString = function(aDate)
    {
        if (aDate) {
            var h = aDate.getHours();
            var mm = aDate.getMinutes();
            var s = aDate.getSeconds();
            return twoDigits(h) + ":" + twoDigits(mm);
        }
        return null;
    };
    

    /** (number) -> string
     * Возвращает строку формата ЧЧ:ММ:СС для интервала, переданного количеством миллисекунд.
     * @param aMillis Параметр типа number. Количество миллисекунд.
     * @return Строка формата ЧЧ:ММ:СС<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.millisecondsToTimeInterval = function(aMillis) {
        if (aMillis) {
            var timeBetween = Math.floor(aMillis / 1000);
            var seconds = timeBetween % 60;
            timeBetween = (timeBetween - seconds) / 60;
            var minutes = timeBetween % 60;
            var hours = (timeBetween - minutes) / 60;
            return hours + ":" + twoDigits(minutes) + ":" + twoDigits(seconds);
        }
        return 0;
    };

    self.describeDeepness = function(aTimeStamp) {
        var moment = new Date();
        var today = self.beginOfDay(moment);
        var yesterday = self.beginOfDay(self.incDay(moment, -1));
        var week = self.beginOfWeek(moment);
        var pastWeek = self.beginOfWeek(self.incDay(moment, -7));
        var year = self.beginOfYear(moment);
        if (aTimeStamp < moment) {
            if (aTimeStamp < today) {
                if (aTimeStamp < yesterday) {
                    if (aTimeStamp < week) {
                        if (aTimeStamp < pastWeek) {
                            if (aTimeStamp < year) {
                                return "В прошлом году";
                            } else
                                return "Больше недели назад";
                        } else
                            return 'На прошлой неделе';
                    } else
                        return "На неделе";
                } else
                    return "Вчера";
            } else
                return "Сегодня";
        } else
            return "Сейчас";
    };

    /** (number, number, number, number, number, number, number) -> date <br>
     * Возвращает дату-время, собранную из составных частей.
     * @param aYear Параметр типа number. Год в формате ГГГГ
     * @param aMonth Параметр типа number. Месяц от 1 (Янв) до 12 (Дек)
     * @param aDay Параметр типа number. День месяца от 1 до 31.
     * @param aHour Параметр типа number. Должен быть указан, если указан параметр <i>aMinute</i>. Устанавливает кол-во часов от 0 до 23.
     * @param aMinute Параметр типа number. Должен быть указан, если указан параметр <i>aSecond</i>. Устанавливает количество минут: от 0 до 59.
     * @param aSecond Параметр типа number. Должен быть указан, если указан параметр <i>aMillisecond</i>. Устанавливает количество секунд: от 0 до 59.
     * @param aMillisecond Количество миллисекунд: от 0 до 999.
     * @return Значение типа date, содержащее дату.<br>
     * Если хотя бы один из параметров  <i>aYear</i>, <i>aMonth</i> или <i>aDay</i> не определен
     * или меньше нуля, то функция вернет <code>null</code>.<br>
     * Если значение месяца выходит за рамки определенного диапазона, то функция вернет <code>null</code>.<br>
     * Если значение дня выходит за рамки определенного диапазона, то функция вернет <code>null</code>.<br>
     * Если значение параметров времени выходит за рамки определенных диапазонов, 
     * то соответствующий параметр будет установлен в ноль.
     */
    self.date = function(aYear, aMonth, aDay, aHour, aMinute, aSecond, aMillisecond)
    {
        if (!aYear || !aMonth || !aDay)
            return null;
        var dt = new Date(1970, 0, 1);
        if (aYear > 0)
            dt.setFullYear(aYear);
        else
            return null;
        if (aMonth >= 1 && aMonth <= 12)
            dt.setMonth(aMonth);
        else
            return null;
        if (aDay >= 1 && aDay <= self.daysInMonth(dt))
            dt.setDate(aDay);
        else
            return null;
        if (aHour && aHour >= 0 && aHour <= 23)
            dt.setHours(aHour);
        if (aMinute && aMinute >= 0 && aMinute <= 59)
            dt.setMinutes(aMinute);
        if (aSecond && aSecond >= 0 && aSecond <= 59)
            dt.setSeconds(aSecond);
        if (aMillisecond && aMillisecond >= 0 && aMillisecond <= 999)
            dt.setMilliseconds(aMillisecond);
        return dt;
    };

    /** (date) -> date
     * Возвращает значение типа дата/время без миллисекунд.
     * @param aDateTime Параметр типа date
     * @return Значение параметра <i>aDateTime</i> без миллисекунд.<br>
     * Если параметр <i>aDateTime</i> не определен, то функция вернет <code>null</code>.
     */
    self.unpreciseDateTime = function(aDateTime)
    {
        if (aDateTime) {
            var dt = new Date(aDateTime.getTime());
            dt.setMilliseconds(0);
            return dt;
        }
        return null;
    };

    self.amountDescription = function(amount, txt1, txt0_5, txt24, txt1114)
    {
        var desc = null;
        amount = Math.abs(amount);
        var tailAmount = Math.round((amount / 10 - Math.floor(amount / 10)) * 10);
        var tailAmount2 = Math.round((amount / 100 - Math.floor(amount / 100)) * 100);
        if (tailAmount2 > 10 && tailAmount2 < 15)
        {
            desc = txt1114;
        } else
        {
            if (tailAmount < 1)
            {
                desc = txt0_5;
            } else if (tailAmount == 1)
            {
                desc = txt1;
            } else if (tailAmount > 1 && tailAmount < 5)
            {
                desc = txt24;
            } else
            {
                desc = txt0_5;
            }
        }
        return desc;
    };

    /** (date, date) -> number <br>
     * Возвращает период ночного времени, в миллисекундах
     * @param aBegDate Параметр типа date. Начало ночного периода
     * @param aEndDate Параметр типа date. Конец ночного периода
     * @return Число миллисекунд.
     */
    self.calcNightPeriod = function(aBegDate, aEndDate)
    {
        if (aEndDate > aBegDate)
        {
            var leftNightBegin = self.beginOfNight(aBegDate);
            var rightNightBegin = self.beginOfNight(aEndDate);

            var leftNightEnd = self.endOfNight(leftNightBegin);
            var leftNightPeriod = leftNightEnd - leftNightBegin;
            var leftPeriod = aBegDate - leftNightBegin;
            var leftNight = 0;
            if (leftPeriod < leftNightPeriod)
                leftNight = leftNightPeriod - leftPeriod;

            if (leftNightBegin != rightNightBegin)
            {
                var rightNightEnd = self.endOfNight(rightNightBegin);
                var rightNightPeriod = rightNightEnd - rightNightBegin;
                var rightPeriod = aEndDate - rightNightBegin;
                var rightNight = rightPeriod;
                if (rightNightPeriod < rightNight)
                    rightNight = rightNightPeriod;

                var middleNight = (self.daysBetween(leftNightBegin, rightNightBegin) - 1) * 8 * 3600 * 1000;
                return leftNight + middleNight + rightNight;
            } else
            {
                if (leftNight > 0)
                {
                    return rightNight - leftPeriod;
                } else
                    return 0;
            }
        } else
            return 0;
    };

    /** (date) -> date <br>
     * Возвращает ближайшее слева начало ночи
     * @param aDate Параметр типа date. 
     * @return Значение параметра <i>aDate</i> со значением часов, равным 22.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.beginOfNight = function(aDate) {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            var h = self.hourOf(aDate);
            if (h < 22)
                dt.setDate(dt.getDate() - 1);
            dt.setHours(22);
            dt.setMinutes(0);
            dt.setSeconds(0);
            dt.setMilliseconds(0);
            return dt;
        } else
            return null;
    };

    /** (date) -> date <br>
     * Возвращает ближайший слева конец ночи, т.е. первый момент утра, следующего за переданным концом ночи.
     * @param aDate Параметр типа date. 
     * @return Значение параметра <i>aDate</i> со значением часов, равным 6.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    self.endOfNight = function(aDate)
    {
        if (aDate) {
            var dt = self.beginOfNight(aDate);
            dt.setDate(dt.getDate() + 1);
            dt.setHours(6);
            dt.setMinutes(0);
            dt.setSeconds(0);
            dt.setMilliseconds(0);
            return dt;
        }
        return null;
    };

    /**  (date) -> boolean <br>
     * Определяет равенство двух дат путем сравнения количества миллисекунд.
     * @param aDate1 Параметр типа date 
     * @param aDate2 Параметр типа date
     * @return <code>true</code> - если даты <i>Date1</i> и <i>Date2</i> одинаковы, <code>false</code> - в противоположном случае.<br>
     * Если один из параметров не определен, то функция вернет <code>null</code>.
     */
    self.equal = function(aDate1, aDate2) {
        if (aDate1 && aDate2)
            return aDate1.getTime() == aDate2.getTime();
        return null;
    };

    /**
     * Получает дату из формата ISO 8601.
     * @see http://stackoverflow.com/questions/6228302/javascript-date-iso8601
     * @param {String} s Дата в формате ISO 8601.
     * @returns {Date|NaN} Дата
     */
    self.fromIso8601 = function(s) {
        var testDt = new Date('2011-06-02T09:34:29+02:00');
        if (isNaN(testDt) || testDt.getUTCMonth() !== 5 || testDt.getUTCDate() !== 2 ||
                testDt.getUTCHours() !== 7 || testDt.getUTCMinutes() !== 34) {

            var day, tz,
                    rx = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
                    p = rx.exec(s) || [];
            if (p[1]) {
                day = p[1].split(/\D/);
                for (var i = 0, L = day.length; i < L; i++) {
                    day[i] = parseInt(day[i], 10) || 0;
                }
                day[1] -= 1;
                day = new Date(Date.UTC.apply(Date, day));
                if (!day.getDate())
                    return NaN;
                if (p[5]) {
                    tz = (parseInt(p[5], 10) * 60);
                    if (p[6])
                        tz += parseInt(p[6], 10);
                    if (p[4] == '+')
                        tz *= -1;
                    if (tz)
                        day.setUTCMinutes(day.getUTCMinutes() + tz);
                }
                return day;
            }
            return NaN;
        } else {
            return new Date(s);
        }
    };

    self.getWeekDay = function(aDayNumber) {
        var days = ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        return days[aDayNumber - 1];
    };
}