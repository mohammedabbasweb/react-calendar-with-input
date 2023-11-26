import React, { forwardRef } from 'react'
import dayjs, { Dayjs } from "dayjs"
import calendar from "dayjs/plugin/calendar"
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

dayjs.extend(calendar)



type Props = {
    selectedDate?: Dayjs | null;
    showDate: Dayjs;
    minDate?: string | null;
    maxDate?: string | null;
    disabledWeekends?: boolean;
    disabledDays?: string[]
    updateSelectedDate: (val: Dayjs) => void
}

const CalendarDayView = forwardRef<HTMLDivElement, Props>((props, ref) => {

    dayjs()

    const weekNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const { selectedDate, showDate, minDate, maxDate, updateSelectedDate, disabledWeekends, disabledDays } = props

    // const getToday = dayjs()

    // const getDate = showDate ? showDate : getToday

    const prevDates = showDate.set("date", 1).day()

    const nextDates = showDate.set("date", showDate.daysInMonth()).day()

    const updatedPrevDates = prevDates <= 0 ? 7 - 1 : prevDates - 1

    const updatedNextDates = nextDates > 0 ? 7 - nextDates : 0

    const allDatesInNumber = showDate?.daysInMonth() + updatedPrevDates + updatedNextDates

    const minDateDayjs = dayjs(minDate, "DD/MM/YYYY")
    const maxDateDayjs = dayjs(maxDate, "DD/MM/YYYY").add(1, "day")


    const allDate = Array.from({ length: allDatesInNumber }, (_, i) => {

        if (updatedPrevDates - i > 0) {

            return showDate.set('date', i + 1).subtract(updatedPrevDates, 'day')

        } else if (allDatesInNumber - updatedNextDates < i + 1) {

            return showDate.set('date', i + 1 - updatedPrevDates)

        } else {

            return showDate.set('date', i + 1 - updatedPrevDates)
        }
    }
    );



    return (
        <>
            <div className='calendar-day-view-container' ref={ref}>
                <div className='calendar-day-view-weekdays'>
                    {weekNames.map((weekDay, index) => {

                        return (
                            <div key={index} className='calendar-day-view-weekdays-weekday'>
                                <abbr title={weekDay}>{weekDay.slice(0, 3)}</abbr>
                            </div>
                        )
                    })}
                </div>
                <div className='calendar-day-view-days'>
                    {allDate?.map((date, index) => {
                        let classNames = "calendar-day-view-days-day"

                        if (selectedDate?.format("DD/MM/YYYY") === date.format("DD/MM/YYYY")) {
                            classNames = `${classNames} active-day`
                        }
                        if (showDate.month() !== date.month()) {
                            classNames = `${classNames} neighborDate`
                        }
                        if (date.day() === 6 || date.day() === 0) {
                            classNames = `${classNames} weekends-date`
                        }

                        let dayDisabled = false

                        if (!dayDisabled && minDateDayjs.isAfter(date)) {
                            dayDisabled = true
                        }

                        if (!dayDisabled && maxDateDayjs.isBefore(date)) {
                            dayDisabled = true
                        }

                        if (!dayDisabled && disabledWeekends) {
                            dayDisabled = [0, 6].includes(date.day())
                        }

                        if (!dayDisabled && disabledDays && disabledDays.length > 0) {
                            const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

                            const dayInNumber: number[] = []
                            disabledDays?.forEach(day => {
                                if (dayNames.includes(day.toLowerCase())) {
                                    dayInNumber.push(dayNames.indexOf(day.toLowerCase()))
                                }
                            })
                            dayDisabled = dayInNumber.includes(date.day())
                        }


                        return (
                            <button key={index} className={classNames} type='button' onClick={() => updateSelectedDate(showDate.set("date", date.date()))} disabled={dayDisabled} >
                                <abbr title={date.format("DD/MM/YYYY")}>{date.date()}</abbr>
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )
})

export default CalendarDayView