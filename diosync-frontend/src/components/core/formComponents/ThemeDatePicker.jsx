import React from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { PiPlaceholder } from 'react-icons/pi'

function ThemeDatePicker({
  label,
  selected,
  onChange,
  dateFormat,
  showTimeSelect,
  excludeTimes,
  className,
  minDate,
  maxDate,
  placeholder,
}) {
  return (
    <div className='flex flex-col '>
      {label && <label className='text-gray-700'>{label}</label>}
      <ReactDatePicker
        showTimeSelect={showTimeSelect}
        selected={selected}
        onChange={onChange}
        dateFormat={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholder}
        calendarClassName='custom-datepicker'
        className={`rounded-lg border border-medium-grey px-4 py-[10px] text-sm leading-6 font-semibold w-full focus:outline-0 focus:border-dark-grey placeholder:text-dark-grey placeholder:font-semibold text-site-black ${className ? className : ''}`}
      />
    </div>
  )
}

export default ThemeDatePicker
