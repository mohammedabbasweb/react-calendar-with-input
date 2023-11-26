import dayjs, { Dayjs } from 'dayjs'
import React, { forwardRef } from 'react'


type MonthProps = {
    selectedDate?: Dayjs | null
    showDate: Dayjs;
    minDate?: string | null;
    maxDate?: string | null;
    changeShowDate: (val: Dayjs, displayView?: string) => void
}


const CalendarMonthView = forwardRef<HTMLDivElement, MonthProps>((props, ref) => {

    const { selectedDate, showDate, minDate, maxDate, changeShowDate } = props

    //const allMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


    console.log("maxDate", maxDate);


    const minDateDayjs = dayjs(minDate, "DD/MM/YYYY")
    const maxDateDayjs = dayjs(maxDate, "DD/MM/YYYY")

    const allMonths = Array.from({ length: 12 }, (_, i) => {
        return showDate.set('month', i)
    })

    console.log(maxDateDayjs.toDate());
    console.log(showDate.toDate());





    return (
        <>
            <div className='calendar-month-view-container' ref={ref}>
                <div className='calendar-month-view-months'>
                    {
                        allMonths.map((month, i) => {

                            const classNames = selectedDate?.format("MMM-YYYY") === month.format("MMM-YYYY") ? "calendar-month-view-month active-month" : "calendar-month-view-month"
                            console.log(maxDateDayjs.isBefore(month));
                            return (
                                <button key={i} className={classNames} type='button' onClick={() => changeShowDate(showDate.set("month", month.month()), 'day')} disabled={minDateDayjs.isAfter(month) || maxDateDayjs.isBefore(month)} >
                                    <abbr title={month.format('MMM YYYY')}>{month.format("MMMM")}</abbr>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
})

export default CalendarMonthView