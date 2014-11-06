/**
 * @name DateUtilsTestForm
*/

function DateUtilsTestForm() {


var self = this;

var dates = Modules.get("DatesUtils");

function tabTestDatesFunctions_stateChanged(ev)
{
    self.model.params.parDate1 = null;
    self.model.params.parDate2 = null;
    self.model.params.parAmount = null;
}

function btnCurrentDateTime_actionPerformed(ev)
{
    self.model.params.parDate1 = dates.currentDateTime();
}

function btnCurrentDate_actionPerformed(ev)
{
    self.model.params.parDate1 = dates.currentDate();	
}

function btnCurrentTime_actionPerformed(ev)
{
    self.model.params.parDate1 = dates.currentTime();	
}

function bntIncDay_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.incDay(self.model.params.parDate1, self.model.params.parAmount);
}

function btnIncMonth_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.incMonth(self.model.params.parDate1, self.model.params.parAmount);	
}

function btnIncYear_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.incYear(self.model.params.parDate1, self.model.params.parAmount);		
}

function btnBeginOfDay_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.beginOfDay(self.model.params.parDate1);
}

function btnEndOfDay_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.endOfDay(self.model.params.parDate1);	
}

function btnBeginOfWeek_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.beginOfWeek(self.model.params.parDate1);
}

function btnEndOfWeek_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.endOfWeek(self.model.params.parDate1);		
}

function btnBeginOfMonth_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.beginOfMonth(self.model.params.parDate1);	
}

function btnEndOfMonth_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.endOfMonth(self.model.params.parDate1);		
}

function btnBeginOfQuart_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.beginOfQuart(self.model.params.parDate1);
}

function btnEndOfQuart_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.endOfQuart(self.model.params.parDate1);	
}

function btnBeginOfYear_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.beginOfYear(self.model.params.parDate1);		
}

function btnEndOfYear_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.endOfYear(self.model.params.parDate1);		
}

function btnYearOf_actionPerformed(ev)
{
    self.model.params.parAmount = dates.yearOf(self.model.params.parDate1);
}

function btnMonthOf_actionPerformed(ev)
{
    self.model.params.parAmount = dates.monthOf(self.model.params.parDate1);	
}

function btnDayOf_actionPerformed(ev)
{
    self.model.params.parAmount = dates.dayOf(self.model.params.parDate1);	
}

function btnHourOf_actionPerformed(ev)
{
    self.model.params.parAmount = dates.hourOf(self.model.params.parDate1);		
}

function btnMinuteOf_actionPerformed(ev)
{
    self.model.params.parAmount = dates.minuteOf(self.model.params.parDate1);		
}

function btnSecondOf_actionPerformed(ev)
{
    self.model.params.parAmount = dates.secondOf(self.model.params.parDate1);	
}

function btnMillisecondOf_actionPerformed(ev)
{
    self.model.params.parAmount = dates.millisecondOf(self.model.params.parDate1);	
}

function btnWeekOfYear_actionPerformed(ev)
{
    self.model.params.parAmount = dates.weekOfYear(self.model.params.parDate1);
}

function btnDayOfYear_actionPerformed(ev)
{
    self.model.params.parAmount = dates.dayOfYear(self.model.params.parDate1);	
}

function btnDayOfWeek_actionPerformed(ev)
{
    self.model.params.parAmount = dates.dayOfWeek(self.model.params.parDate1);		
}

function btnDaysInYear_actionPerformed(ev)
{
    self.model.params.parAmount = dates.daysInYear(self.model.params.parDate1);			
}

function btnDaysInMonth_actionPerformed(ev)
{
    self.model.params.parAmount = dates.daysInMonth(self.model.params.parDate1);				
}

function btnUnpreciseDate_actionPerformed(ev)
{
    if(self.model.params.parDate1 != null)
    {
        self.model.params.parDate2 = dates.unpreciseDateTime(self.model.params.parDate1);
        var cal = java.util.Calendar.getInstance();
        cal.time = self.model.params.parDate2;
        if(cal.get(java.util.Calendar.MILLISECOND) != 0)
            alert("Тест провалился. Миллисекунды == "+cal.get(java.util.Calendar.MILLISECOND), self.title);
    }else
        alert("Выберите дату в поле ввода.", self.title);
}

function btnDaysDescription_actionPerformed(ev)
{
    var daysAmount = dates.daysBetween(self.model.params.parDate1, self.model.params.parDate2);
    self.model.params.parDescription = daysAmount + ' ' + dates.amountDescription(daysAmount, 'день', 'дней', 'дня', 'дней');
}

function btnIncMinute_actionPerformed(ev)
{
    self.model.params.parDate2 = dates.incMinute(self.model.params.parDate1, self.model.params.parAmount);	
}

function btnNightCalc_actionPerformed(ev)
{
    self.model.params.parAmount = dates.calcNightPeriod(self.model.params.parDate1, self.model.params.parDate2)/1000/60/60;
}

function btnDaysInMonthByNum_actionPerformed(ev)
{
    self.model.params.parAmount = dates.daysInMonthByNum(self.model.params.parNum, self.model.params.parIsLeapYear);
}

function btnDate_actionPerformed(ev)
{
    self.params.parDate1 = dates.date(self.params.parYear, 
        self.params.parMonth,
        self.params.parDay,
        self.params.parHour,
        self.params.parMinute,
        self.params.parSecond,
        self.params.parMillisecond);
}
function btnEqualActionPerformed(evt) {//GEN-FIRST:event_btnEqualActionPerformed
    if (dates.equal(self.model.params.parDate1, self.model.params.parDate2))
        self.lblEqualResult.text = 'Даты эквивалентны';
    else
        self.lblEqualResult.text = 'Даты НЕ эквивалентны';
}//GEN-LAST:event_btnEqualActionPerformed

function bntCopyValueActionPerformed(evt) {//GEN-FIRST:event_bntCopyValueActionPerformed
    self.model.params.parDate2 = self.model.params.parDate1;
}//GEN-LAST:event_bntCopyValueActionPerformed

function btnIncHour_actionPerformed(evt) {//GEN-FIRST:event_btnIncHour_actionPerformed
    self.model.params.parDate2 = dates.incHour(self.model.params.parDate1, self.model.params.parAmount);	
}//GEN-LAST:event_btnIncHour_actionPerformed

}