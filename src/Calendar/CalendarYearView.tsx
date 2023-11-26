import dayjs, { Dayjs } from 'dayjs'
import React, { forwardRef } from 'react'

type yearProps = {
    selectedDate?: Dayjs | null
    showDate: Dayjs;
    minDate?: string | null;
    maxDate?: string | null;
    changeShowDate: (val: Dayjs, displayView: string) => void
}

const CalendarYearView = forwardRef<HTMLDivElement, yearProps>((props, ref) => {

    const { selectedDate, showDate, minDate, maxDate, changeShowDate } = props

    const neartYearStart = Math.abs(showDate.year() % 10)

    const allYears = Array.from({ length: 10 }, (_, i) => {
        return showDate.add(i - neartYearStart + 1, "year")
    })

    const minDateDayjs = dayjs(minDate, "DD/MM/YYYY")
    const maxDateDayjs = dayjs(maxDate, "DD/MM/YYYY")


    //const yearDisabled = minDateDayjs.year() >= showDate.year() && maxDateDayjs.year() <= showDate.year()

    return (
        <>
            <div className='calendar-year-view-container' ref={ref}>
                <div className='calendar-year-view-years'>
                    {
                        allYears.map((year, i) => {

                            const classNames = selectedDate?.year() === year.year() ? "calendar-year-view-year active-year" : "calendar-year-view-year"

                            console.log(maxDateDayjs.year() < year.year());


                            return (
                                <button key={i} className={classNames} type='button' onClick={() => changeShowDate(showDate.set("year", year.year()), "month")} disabled={minDateDayjs.year() > year.year() || maxDateDayjs.year() < year.year()} >
                                    <abbr title={year.year().toString()}>{year.year()}</abbr>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
})

export default CalendarYearView