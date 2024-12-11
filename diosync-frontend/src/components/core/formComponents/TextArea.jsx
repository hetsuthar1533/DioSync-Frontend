import { ErrorMessage, useField } from 'formik'
import React, { useState } from 'react'

function TextArea({ name, disabled, placeholder, rows, className, ...props }) {
  const [field] = useField(name)
  const [focus, setFocus] = useState(false)

  const onBlurHandler = () => setFocus(false)
  const onFocusHandler = () => setFocus(true)

  return (
    <>
      <textarea
        {...field}
        {...props}
        rows={rows}
        name={name}
        placeholder={placeholder}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        disabled={disabled !== undefined ? disabled : false}
        className={`block rounded-lg border border-medium-grey px-4 py-[11px] text-sm leading-6 font-semibold w-full focus:outline-0 focus:border-dark-grey placeholder:text-dark-grey placeholder:font-semibold text-site-black ${className ? className : ''}  ${focus ? 'hasFocus' : ''}`}
      />
      <ErrorMessage name={name}>{(msg) => <div className='text-site-red text-sm font-medium'>{msg}</div>}</ErrorMessage>
    </>
  )
}

export default TextArea
