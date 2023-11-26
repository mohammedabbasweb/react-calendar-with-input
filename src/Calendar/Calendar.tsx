import React, { useEffect, useRef, useState } from 'react'
import CalendarToolbar from './CalendarToolbar'
import dayjs, { Dayjs } from 'dayjs'
import CalendarDayView from './CalendarDayView'
import CalendarMonthView from './CalendarMonthView'
import CalendarYearView from './CalendarYearView'
import './calendar.css'




type Props = {
    value?: string,
    onChange: (val: string) => void,
    openCalendar?: boolean,
    autoClose?: boolean,
    disableCalendar?: boolean,
    format?: string,
    minDate?: string,
    maxDate?: string,
    mainClassName?: string,
    calendarClassName?: string,
    inputClass?: string,
    headerClass?: string,
    daysClass?: string,
    monthsClass?: string,
    yearsClass?: string,
    placeholder?: string,
    nextLabel?: React.ReactNode,
    next2Label?: React.ReactNode,
    prevLabel?: React.ReactNode,
    prev2Label?: React.ReactNode,
    hideNextPrev2Labels?: boolean,
    hideInputField?: boolean,
    disabledWeekends?: boolean,
    disableInputField?: boolean,
    disabledDays?: string[],
}


const Calendar = (props: Props) => {

    const {
        value,
        onChange,
        autoClose = true,
        openCalendar = false,
        disableCalendar,
        placeholder = "Select Date",
        format = "DD-MM-YYYY",
        mainClassName,
        // calendarClassName,
        // inputClass,
        // headerClass,
        // daysClass,
        // monthsClass,
        // yearsClass,
        minDate = null,
        maxDate = null,
        nextLabel = "›",
        next2Label = "»",
        prevLabel = "‹",
        prev2Label = "«",
        hideNextPrev2Labels = false,
        hideInputField = false,
        disableInputField = false,
        disabledWeekends,
        disabledDays,
    } = props

    const calendarRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)
    const toolbarRef = useRef<HTMLDivElement>(null)
    const dayRef = useRef<HTMLDivElement>(null)
    const monthRef = useRef<HTMLDivElement>(null)
    const yearRef = useRef<HTMLDivElement>(null)

    const isValue = dayjs(value)

    let selectedDate = value && isValue.isValid() ? isValue : null


    const [view, setView] = useState('day')
    const [showDate, setShowDate] = useState(selectedDate || dayjs())
    const [userSelectedDate, setUserSelectedDate] = useState<Dayjs | null>(selectedDate)

    const [showMyCalendar, setShowMyCalendar] = useState<boolean>(false)




    useEffect(() => {

        if (!hideInputField) {

            if (showMyCalendar) {
                document.addEventListener("click", handleCloseOutsideClick, true)
            }

            return () => {
                document.removeEventListener("click", handleCloseOutsideClick, true)
            }

        } else {
            setShowMyCalendar(openCalendar)
        }
    }, [showMyCalendar, userSelectedDate, showDate, openCalendar])



    const handleCloseOutsideClick = (e: Event) => {
        const currentDay = dayRef.current
        const currentMonth = monthRef.current
        const currentYear = yearRef.current
        const currentToolBar = toolbarRef.current
        const currentInput = inputRef.current


        const target = e.target as HTMLElement


        if (!currentDay?.contains(target) && !currentMonth?.contains(target) && !currentYear?.contains(target) && !currentToolBar?.contains(target) && !currentInput?.contains(target)) {
            setShowMyCalendar(false)
        }
    }

    const changeShowDate = (val: Dayjs, displayView?: string) => {
        setShowDate(val)
        if (displayView && view !== displayView) {
            setView(displayView)
        } else if (displayView && view === displayView) {
            setView(displayView)
            setUserSelectedDate(val)
        }
    }

    const updateSelectedDate = (val: Dayjs) => {

        setShowDate(val)
        setUserSelectedDate(val)
        if (autoClose && !hideInputField) {
            setShowMyCalendar(false)
        }
        onChange(val.format(format))
    }


    const changeView = (val: string) => {
        setView(val)
    }

    const renderToolbar = () => {

        const allProps = {
            selectedDate: userSelectedDate,
            showDate: showDate,
            changeView: changeView,
            view: view,
            changeShowDate: changeShowDate,
            minDate: minDate,
            maxDate: maxDate,
            nextLabel: nextLabel,
            next2Label: next2Label,
            prevLabel: prevLabel,
            prev2Label: prev2Label,
            hideNextPrev2Labels: hideNextPrev2Labels,
        }

        return (
            <CalendarToolbar ref={toolbarRef} {...allProps} />
        )
    }

    const renderDayView = () => {

        if (view === "day") {
            return (
                <CalendarDayView ref={dayRef} showDate={showDate} selectedDate={userSelectedDate} updateSelectedDate={updateSelectedDate} minDate={minDate} maxDate={maxDate} disabledWeekends={disabledWeekends} disabledDays={disabledDays} />
            )
        } else {
            return null
        }
    }

    const renderMonthView = () => {

        if (view === "month") {
            return (
                <CalendarMonthView ref={monthRef} showDate={showDate} selectedDate={userSelectedDate} changeShowDate={changeShowDate} minDate={minDate} maxDate={maxDate} />
            )
        } else {
            return null
        }
    }

    const renderYearView = () => {

        if (view === "year") {
            return (
                <CalendarYearView ref={yearRef} showDate={showDate} selectedDate={userSelectedDate} changeShowDate={changeShowDate} minDate={minDate} maxDate={maxDate} />
            )
        } else {
            return null
        }
    }

    const handleShowCalendar = (e: any) => {
        e.preventDefault()
        if (disableCalendar !== true) {
            setShowMyCalendar(true)
        }
    }



    return (
        <>
            <div className={`my-calendar-container ${mainClassName ? mainClassName : ""}`}>
                {
                    !hideInputField ?
                        <div ref={inputRef} className='calendar-input-container'>
                            <input type="text" className='calendar-input-field' placeholder={placeholder} value={userSelectedDate?.format("DD/MM/YYYY") || ""} readOnly onClick={handleShowCalendar} disabled={disableInputField} />
                        </div>
                        : null
                }

                {
                    showMyCalendar ?
                        <div className='calendar-main-container' ref={calendarRef}>
                            <div className='calendar-toolbar'>
                                {renderToolbar()}
                            </div>
                            <div className='calendar-body'>
                                {renderDayView()}
                                {renderMonthView()}
                                {renderYearView()}
                            </div>
                        </div>
                        : null
                }
            </div>
        </>
    )
}

export default Calendar