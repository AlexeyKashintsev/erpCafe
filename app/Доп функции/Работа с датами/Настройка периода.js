/**
 * @name PeriodSelector
 * 
 * old - 126718905053857
 */

function PeriodSelector() {

    var self = this;
    var PERIOD_IS_SET = "Установлен период: ",
            PERIOD_IS_NOT_SET = "Период не установлен";
    var dates = Modules.get("DatesUtils");

    /** Формирует строку с выбранным периодом для отображения на форме
     */
    function setPeriodText()
    {
        var lBegDateText = dates.dateTimeToString(self.model.params.parBegDate);
        var lEndDateText = dates.dateTimeToString(self.model.params.parEndDate);
        if (lBegDateText == null && lEndDateText == null)
            self.lblPeriod.text = PERIOD_IS_NOT_SET
        else {
            if (lBegDateText == null)
                lBegDateText = "...";
            if (lEndDateText == null)
                lEndDateText = "...";
            self.lblPeriod.text = PERIOD_IS_SET + lBegDateText + " - " + lEndDateText;
        }
    }

    /** Устанавливает доступность некоторых компонентов панели "начальных дат" 
     * (левая панель на вкладке "Интервал") в зависимости от того, какая радиокнопка нажата
     * @param aRadioButton Выбранная радиокнопка, влияющая на доступность других компонентов
     */
    function setBDGroupControlsEnabled(aRadioButton)
    {
        switch (aRadioButton) {
            case self.rbBD_daysBeforeTA:
                self.edBD_daysBeforeTA.editable = true;
                self.edBD_anyDate.editable = false;
                break;
            case self.rbBD_anyDate:
                self.edBD_daysBeforeTA.editable = false;
                self.edBD_anyDate.editable = true;
                break;
            default :
                self.edBD_daysBeforeTA.editable = false;
                self.edBD_anyDate.editable = false;
        }
    }

    /** Устанавливает доступность некоторых компонентов панели "конечных дат" 
     * (правая панель на вкладке "Интервал") в зависимости от того, какая радиокнопка нажата
     * @param aRadioButton Выбранная радиокнопка, влияющая на доступность других компонентов
     */
    function setEDGroupControlsEnabled(aRadioButton)
    {
        switch (aRadioButton) {
            case self.rbED_daysAfterTA:
                self.edED_daysAfterTA.editable = true;
                self.edED_anyDate.editable = false;
                break;
            case self.rbED_anyDate:
                self.edED_daysAfterTA.editable = false;
                self.edED_anyDate.editable = true;
                break;
            default :
                self.edED_daysAfterTA.editable = false;
                self.edED_anyDate.editable = false;
        }
    }

    /** Вызывает соответствующую функцию установки "рабочего" (т.е. актуального) период в зависимости от того,
     *  какая радиокнопка выбрана на вкладке "Период"
     */
    function setWorkPeriod() {
        if (self.rbYear.selected)
            setWorkYear()
        else if (self.rbMonth.selected)
            setWorkMonth()
        else if (self.rbDay.selected)
            setWorkDay()
    }

    /** Устанавливает доступность компонентов для редактирования года, месяца и дня
     *   на вкладке "Период".
     */
    function setWorkPeriodControlsEnabled()
    {
        self.edYear.editable = self.rbYear.selected && !isWorkPeriod();
        self.edMonth.editable = self.rbMonth.selected && !isWorkPeriod();
        self.edDay.editable = self.rbDay.selected && !isWorkPeriod();
    }
    /**
     * Возвращает выбранный период в виде объекта со свойствами
     * @return Объект со свойствами <code>begdate</code> - начало выбранного периода
     *  и <code>enddate</code> - конец выбранного периода
     */
    function getPeriod() {
        return {
            begdate: self.model.params.parBegDate,
            enddate: self.model.params.parEndDate
        };
    }

    /** Определяет, установлен ли флажок "Рабочий период"
     * @return Возвращает <code>true</code>, если установлен флажок "Рабочий период".
     * В противном случае - <code>false</code>.
     * 
     */
    function isWorkPeriod()
    {
        return self.model.params.parIsWorkPeriod != null && self.model.params.parIsWorkPeriod > 0;
    }

    /** Устанавливает границы периода.
     * @param aBegDate Начало периода
     * @param aEndDate Конец периода
     */
    self.setPeriodBounds = function(aBegDate, aEndDate) {
        self.model.params.parBegDate = aBegDate;
        self.model.params.parEndDate = aEndDate;
    };

    /** Очищает период, устанавливая значения его границ в <code>null</code>
     */
    function nullifyPeriodBounds()
    {
        self.setPeriodBounds(null, null);
    }

    /** Устанавливает значение параметра "Год" в начало текущего года
     */
    function setWorkYear()
    {
        self.model.params.parYear = dates.beginOfYear(self.model.params.parTA);
    }

    /** Настраивает границы выбранного периода на основе значения параметра "Год"
     */
    function setPeriodBoundsByYear()
    {
        if (self.model.params.parYear != null)
            self.setPeriodBounds(dates.beginOfYear(self.model.params.parYear), dates.endOfYear(self.model.params.parYear))
        else
            nullifyPeriodBounds();
    }

    /** Устанавливает значение параметра "Месяц" в начало текущего года
     */
    function setWorkMonth()
    {
        self.model.params.parMonth = dates.beginOfMonth(self.model.params.parTA);
    }

    /** Настраивает границы выбранного периода на основе значения параметра "Месяц"
     */
    function setPeriodBoundsByMonth()
    {
        if (self.model.params.parMonth != null)
            self.setPeriodBounds(dates.beginOfMonth(self.model.params.parMonth), dates.endOfMonth(self.model.params.parMonth))
        else
            nullifyPeriodBounds();
    }

    /** Устанавливает значение параметра "День" в начало текущего года
     */
    function setWorkDay()
    {
        self.model.params.parDay = dates.beginOfDay(self.model.params.parTA);
    }

    /** Настраивает границы выбранного периода на основе значения параметра "День"
     */
    function setPeriodBoundsByDay()
    {
        if (self.model.params.parDay != null)
            self.setPeriodBounds(dates.beginOfDay(self.model.params.parDay), dates.endOfDay(self.model.params.parDay))
        else
            nullifyPeriodBounds();
    }

    function setPeriodControlsEnabled(aRadioButton)
    {
        var lIsAnyPeriod = aRadioButton == self.rbAnyPeriod;
        self.chkIsWorkPeriod.enabled = !lIsAnyPeriod;
        self.edAnyBegDay.editable = lIsAnyPeriod;
        self.edAnyEndDay.editable = lIsAnyPeriod;
        setWorkPeriodControlsEnabled();
    }
function btnCloseActionPerformed(evt) {//GEN-FIRST:event_btnCloseActionPerformed
        self.close();
}//GEN-LAST:event_btnCloseActionPerformed

function btnSelectActionPerformed(evt) {//GEN-FIRST:event_btnSelectActionPerformed
        self.close(getPeriod());
}//GEN-LAST:event_btnSelectActionPerformed

function rbBD_NoValueActionPerformed(evt) {//GEN-FIRST:event_rbBD_NoValueActionPerformed
        setBDGroupControlsEnabled();
        self.model.params.parBegDate = null;
}//GEN-LAST:event_rbBD_NoValueActionPerformed

function rbBD_daysBeforeTAActionPerformed(evt) {//GEN-FIRST:event_rbBD_daysBeforeTAActionPerformed
        setBDGroupControlsEnabled(self.rbBD_daysBeforeTA);
        self.model.params.parBegDate = dates.incDay(self.model.params.parTA, (-1) * self.model.params.parDaysBeforeTA);
}//GEN-LAST:event_rbBD_daysBeforeTAActionPerformed

function rbBD_beginOfYearActionPerformed(evt) {//GEN-FIRST:event_rbBD_beginOfYearActionPerformed
        setBDGroupControlsEnabled(self.rbBD_beginOfYear);
        self.model.params.parBegDate = dates.beginOfYear(self.model.params.parTA);
}//GEN-LAST:event_rbBD_beginOfYearActionPerformed

function rbBD_beginOfQuartActionPerformed(evt) {//GEN-FIRST:event_rbBD_beginOfQuartActionPerformed
        setBDGroupControlsEnabled(self.rbBD_beginOfQuart);
        self.model.params.parBegDate = dates.beginOfQuart(self.model.params.parTA);
}//GEN-LAST:event_rbBD_beginOfQuartActionPerformed

function rbBD_beginOfMonthActionPerformed(evt) {//GEN-FIRST:event_rbBD_beginOfMonthActionPerformed
        setBDGroupControlsEnabled(self.rbBD_beginOfMonth);
        self.model.params.parBegDate = dates.beginOfMonth(self.model.params.parTA);
}//GEN-LAST:event_rbBD_beginOfMonthActionPerformed

function rbBD_beginOfWeekActionPerformed(evt) {//GEN-FIRST:event_rbBD_beginOfWeekActionPerformed
        setBDGroupControlsEnabled(self.rbBD_beginOfWeek);
        self.model.params.parBegDate = dates.beginOfWeek(self.model.params.parTA);
}//GEN-LAST:event_rbBD_beginOfWeekActionPerformed

function rbBD_beginOfDayActionPerformed(evt) {//GEN-FIRST:event_rbBD_beginOfDayActionPerformed
        setBDGroupControlsEnabled(self.rbBD_beginOfDay);
        self.model.params.parBegDate = dates.beginOfDay(self.model.params.parTA);
}//GEN-LAST:event_rbBD_beginOfDayActionPerformed

function rbBD_anyDateActionPerformed(evt) {//GEN-FIRST:event_rbBD_anyDateActionPerformed
        setBDGroupControlsEnabled(self.rbBD_anyDate);
}//GEN-LAST:event_rbBD_anyDateActionPerformed

function rbED_NoValueActionPerformed(evt) {//GEN-FIRST:event_rbED_NoValueActionPerformed
        setEDGroupControlsEnabled();
        self.model.params.parEndDate = null;
}//GEN-LAST:event_rbED_NoValueActionPerformed

function rbED_daysAfterTAActionPerformed(evt) {//GEN-FIRST:event_rbED_daysAfterTAActionPerformed
        setEDGroupControlsEnabled(self.rbED_daysAfterTA);
        self.model.params.parEndDate = dates.incDay(self.model.params.parTA, self.model.params.parDaysAfterTA);
}//GEN-LAST:event_rbED_daysAfterTAActionPerformed

function rbED_endOfYearActionPerformed(evt) {//GEN-FIRST:event_rbED_endOfYearActionPerformed
        setEDGroupControlsEnabled(self.rbED_endOfYear);
        self.model.params.parEndDate = dates.endOfYear(self.model.params.parTA);
}//GEN-LAST:event_rbED_endOfYearActionPerformed

function rbED_endOfQuartActionPerformed(evt) {//GEN-FIRST:event_rbED_endOfQuartActionPerformed
        setEDGroupControlsEnabled(self.rbED_endOfQuart);
        self.model.params.parEndDate = dates.endOfQuart(self.model.params.parTA);
}//GEN-LAST:event_rbED_endOfQuartActionPerformed

function rbED_endOfMonthActionPerformed(evt) {//GEN-FIRST:event_rbED_endOfMonthActionPerformed
        setEDGroupControlsEnabled(self.rbED_endOfMonth);
        self.model.params.parEndDate = dates.endOfMonth(self.model.params.parTA);
}//GEN-LAST:event_rbED_endOfMonthActionPerformed

function rbED_endOfWeekActionPerformed(evt) {//GEN-FIRST:event_rbED_endOfWeekActionPerformed
        setEDGroupControlsEnabled(self.rbED_endOfWeek);
        self.model.params.parEndDate = dates.endOfWeek(self.model.params.parTA);
}//GEN-LAST:event_rbED_endOfWeekActionPerformed

function rbED_endOfDayActionPerformed(evt) {//GEN-FIRST:event_rbED_endOfDayActionPerformed
        setEDGroupControlsEnabled(self.rbED_endOfDay);
        self.model.params.parEndDate = dates.endOfDay(self.model.params.parTA);
}//GEN-LAST:event_rbED_endOfDayActionPerformed

function rbED_anyDateActionPerformed(evt) {//GEN-FIRST:event_rbED_anyDateActionPerformed
        setEDGroupControlsEnabled(self.rbED_anyDate);
}//GEN-LAST:event_rbED_anyDateActionPerformed

function rbYearActionPerformed(evt) {//GEN-FIRST:event_rbYearActionPerformed
        setPeriodControlsEnabled(self.rbYear);
        if (isWorkPeriod()) {
            if (!dates.equal(self.model.params.parYear, dates.beginOfYear(self.model.params.parTA)))
                setWorkYear();
            else
                self.setPeriodBounds(dates.beginOfYear(self.model.params.parTA), dates.endOfYear(self.model.params.parTA));
        } else
            setPeriodBoundsByYear();
}//GEN-LAST:event_rbYearActionPerformed

function rbMonthActionPerformed(evt) {//GEN-FIRST:event_rbMonthActionPerformed
        setPeriodControlsEnabled(self.rbMonth);
        if (isWorkPeriod()) {
            if (!dates.equal(self.model.params.parMonth, dates.beginOfMonth(self.model.params.parTA)))
                setWorkMonth();
            else
                self.setPeriodBounds(dates.beginOfMonth(self.model.params.parTA), dates.endOfMonth(self.model.params.parTA));
        } else
            setPeriodBoundsByMonth();
}//GEN-LAST:event_rbMonthActionPerformed

function rbDayActionPerformed(evt) {//GEN-FIRST:event_rbDayActionPerformed
        setPeriodControlsEnabled(self.rbDay);
        if (isWorkPeriod()) {
            if (!dates.equal(self.model.params.parDay, dates.beginOfDay(self.model.params.parTA)))
                setWorkDay();
            else
                self.setPeriodBounds(dates.beginOfDay(self.model.params.parTA), dates.endOfDay(self.model.params.parTA));
        } else
            setPeriodBoundsByDay();
}//GEN-LAST:event_rbDayActionPerformed

function tabStateChanged(evt) {//GEN-FIRST:event_tabStateChanged
        if (self.tab.selectedComponent == self.pnlPeriod) {
            self.rbBD_anyDate.selected = true;
            rbBD_anyDateActionPerformed();
            self.rbED_anyDate.selected = true;
            rbED_anyDateActionPerformed();
            self.rbAnyPeriod.selected = true;
            rbAnyPeriodActionPerformed();
        }
}//GEN-LAST:event_tabStateChanged

function rbAnyPeriodActionPerformed(evt) {//GEN-FIRST:event_rbAnyPeriodActionPerformed
        setPeriodControlsEnabled(self.rbAnyPeriod);
}//GEN-LAST:event_rbAnyPeriodActionPerformed

function onChanged(evt) {//GEN-FIRST:event_onChanged
        switch (evt.field) {
            case self.model.params.schema.parDaysBeforeTA:
                if (evt.oldValue != null && evt.newValue == null)
                    self.model.params.parDaysBeforeTA = 0;
                self.model.params.parBegDate = dates.incDay(self.model.params.parTA, (-1) * self.model.params.parDaysBeforeTA);
                break;
            case self.model.params.schema.parDaysAfterTA:
                if (evt.oldValue != null && evt.newValue == null)
                    self.model.params.parDaysAfterTA = 0;
                self.model.params.parEndDate = dates.incDay(self.model.params.parTA, self.model.params.parDaysAfterTA);
                break;
            case self.model.params.schema.parBegDate:
                setPeriodText();
                break;
            case self.model.params.schema.parEndDate:
                setPeriodText();
                break;
            case self.model.params.schema.parIsWorkPeriod:
                setWorkPeriodControlsEnabled();
                if (isWorkPeriod())
                    setWorkPeriod();
                break;
            case self.model.params.schema.parYear:
                self.model.params.parBegDate = dates.beginOfYear(self.model.params.parYear);
                self.model.params.parEndDate = dates.endOfYear(self.model.params.parYear);
                break;
            case self.model.params.schema.parMonth:
                self.model.params.parBegDate = dates.beginOfMonth(self.model.params.parMonth);
                self.model.params.parEndDate = dates.endOfMonth(self.model.params.parMonth);
                break;
            case self.model.params.schema.parDay:
                self.model.params.parBegDate = dates.beginOfDay(self.model.params.parDay);
                self.model.params.parEndDate = dates.endOfDay(self.model.params.parDay);
                break;
            default :
                break;
        }
}//GEN-LAST:event_onChanged

function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        if (self.model.params.parTA == null)
            self.model.params.parTA = dates.beginOfDay(dates.currentDateTime());

        var selectedBdRb = self.model.params.parBegDate == null ? self.rbBD_NoValue : self.rbBD_anyDate;
        selectedBdRb.selected = true;
        setBDGroupControlsEnabled(selectedBdRb);

        var selectedEdRb = self.model.params.parEndDate == null ? self.rbED_NoValue : self.rbED_anyDate;
        selectedEdRb.selected = true;
        setEDGroupControlsEnabled(selectedEdRb);

        self.model.params.parIsWorkPeriod = 0;
        setPeriodText();
        tabStateChanged(evt);
}//GEN-LAST:event_formWindowOpened

}