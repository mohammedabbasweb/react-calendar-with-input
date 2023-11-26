import React, { forwardRef } from 'react'
import dayjs, { Dayjs } from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)


type ToolbarProps = {
    prev2Label?: React.ReactNode | string;
    next2Label?: React.ReactNode | string;
    nextLabel?: React.ReactNode | string;
    prevLabel?: React.ReactNode | string;
    hideNextPrev2Labels?: boolean;
    shouldShowPrevNext2Buttons?: boolean;
    selectedDate?: Dayjs | null;
    showDate: Dayjs;
    view: string;
    minDate?: string | null;
    maxDate?: string | null;
    changeShowDate: (val: Dayjs, displayView?: string) => void
    changeView: (val: string) => void
}

const CalendarToolbar = forwardRef<HTMLDivElement, ToolbarProps>((props, ref) => {

    const { prev2Label, next2Label, nextLabel, prevLabel, view, minDate, maxDate, changeShowDate, changeView, showDate, hideNextPrev2Labels = false } = props



    const handleChangeShowDate = (type: string) => {
        if (view === "day") {
            if (type === "prev") {
                changeShowDate(showDate.subtract(1, "month"))
            } else if (type === "prev2") {
                changeShowDate(showDate.subtract(1, "year"))
            } else if (type === "next") {
                changeShowDate(showDate.add(1, "month"))
            } else if (type === "next2") {
                changeShowDate(showDate.add(1, "year"))
            }
        } else if (view === "month") {
            if (type === "prev") {
                changeShowDate(showDate.subtract(1, "year"))
            } else if (type === "prev2") {
                changeShowDate(showDate.subtract(10, "year"))
            } else if (type === "next") {
                changeShowDate(showDate.add(1, "year"))
            } else if (type === "next2") {
                changeShowDate(showDate.add(10, "year"))
            }
        } else if (view === "year") {
            if (type === "prev") {
                changeShowDate(showDate.subtract(10, "year"))
            } else if (type === "prev2") {
                changeShowDate(showDate.subtract(100, "year"))
            } else if (type === "next") {
                changeShowDate(showDate.add(10, "year"))
            } else if (type === "next2") {
                changeShowDate(showDate.add(100, "year"))
            }
        }
    }

    const handleChangeView = () => {
        if (view === "day") {
            changeView("month")
        } else if (view === "month") {
            changeView("year")
        }
    }

    let displayView = null

    if (view === "day") {
        displayView = showDate.format("MMMM YYYY")
    } else if (view === "month") {
        displayView = showDate.format("YYYY")
    } else if (view === "year") {
        const neartYearStart = Math.abs(showDate.year() % 10)
        displayView = `${showDate.subtract(neartYearStart - 1, "year").format("YYYY")} - ${showDate.add(10 - neartYearStart, "year").format("YYYY")}`
    }


    const minDateDayjs = dayjs(minDate, "DD/MM/YYYY")
    const maxDateDayjs = dayjs(maxDate, "DD/MM/YYYY")

    let prev2Disabled
    let prevDisabled
    let next2Disabled
    let nextDisabled

    switch (view) {
        case "day":
            prev2Disabled = minDateDayjs.year() > showDate.subtract(1, "year").year()
            prevDisabled = minDateDayjs.month() > showDate.subtract(1, "month").month() && minDateDayjs.year() > showDate.subtract(1, "year").year()
            next2Disabled = maxDateDayjs.year() < showDate.add(1, "year").year()
            nextDisabled = maxDateDayjs.month() < showDate.add(1, "month").month() && maxDateDayjs.year() < showDate.add(1, "year").year()
            break;
        case "month":
            prev2Disabled = minDateDayjs.year() > showDate.subtract(10, 'year').year()
            prevDisabled = minDateDayjs.year() > showDate.subtract(1, "year").year()
            next2Disabled = maxDateDayjs.year() < showDate.add(10, "year").year()
            nextDisabled = maxDateDayjs.year() < showDate.add(1, "year").year()
            break;
        case "year":
            prev2Disabled = minDateDayjs.year() > showDate.subtract(100, 'year').year()
            prevDisabled = minDateDayjs.year() > showDate.subtract(10, "year").year()
            next2Disabled = maxDateDayjs.year() < showDate.add(100, "year").year()
            nextDisabled = maxDateDayjs.year() < showDate.add(10, "year").year()
            break;

        default:
            break;
    }


    return (
        <>
            <div className='calendar-toolbar-container' ref={ref}>
                {
                    !hideNextPrev2Labels && prev2Label ?
                        <button onClick={() => handleChangeShowDate("prev2")} type='button' className='calendar-navigation-buttons' disabled={prev2Disabled} >
                            {prev2Label}
                        </button>
                        :
                        null
                }

                <button onClick={() => handleChangeShowDate("prev")} type='button' className='calendar-navigation-buttons' disabled={prevDisabled} >
                    {prevLabel}
                </button>

                <button onClick={handleChangeView} type='button' className='calendar-navigation-buttons' style={{ flexGrow: 1 }}>
                    {displayView}
                </button>

                <button onClick={() => handleChangeShowDate("next")} type='button' className='calendar-navigation-buttons' disabled={nextDisabled} >
                    {nextLabel}
                </button>

                {
                    !hideNextPrev2Labels && next2Label ?
                        <button onClick={() => handleChangeShowDate("next2")} type='button' className='calendar-navigation-buttons' disabled={next2Disabled} >
                            {next2Label}
                        </button>
                        :
                        null
                }

            </div>
        </>
    )
})

export default CalendarToolbar