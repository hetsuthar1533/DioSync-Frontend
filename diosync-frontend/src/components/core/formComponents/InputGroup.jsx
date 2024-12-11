import { useField } from 'formik'
import React, { useState } from 'react'
import { HiOutlineEyeSlash } from 'react-icons/hi2'
import { SlEye } from 'react-icons/sl'

function InputGroup({ className, type, name, ...props }) {
  const [focused, setFocused] = useState(false)
  const [field] = useField(name)

  const onBlur = () => setFocused(false)
  const onFocus = () => setFocused(true)
  const [isVisible, setVisible] = useState(false)
  const toggle = () => {
    setVisible(!isVisible)
  }
  return (
    <div className='form-control relative'>
      <div
        className={`${
          className ? className : ''
        } flex items-center gap-3 rounded-lg border border-medium-grey xxl:py-[11px] py-[12px] text-sm leading-6 font-semibold w-full focus:outline-0 focus:border-primary-blue focus-within:border-dark-grey placeholder:text-dark-grey placeholder:font-semibold text-site-black px-4`}
      >
        {props?.prefix ? <span>{props?.prefix}</span> : ''}
        <input
          {...props}
          {...field}
          onFocus={onFocus}
          onBlur={(e) => {
            field.onBlur(e)
            onBlur()
          }}
          type={type === 'password' ? (isVisible ? 'text' : 'password') : type}
          className={`${
            className ? className : ''
          } ${focused || field.value ? 'hasFocus' : ''}placeholder:text-dark-grey placeholder:font-semibold text-site-black focus:outline-0 w-full `}
        />
        {type === 'password' ? (
          <span className='absolute right-4 top-[13px] cursor-pointer' onClick={toggle}>
            {isVisible ? <HiOutlineEyeSlash size={20} color='#919297' /> : <SlEye size={20} color='#919297' />}
          </span>
        ) : (
          ''
        )}
        {props?.postfix ? <span>{props?.postfix}</span> : ''}
      </div>
      <span className='text-site-red text-sm font-medium'>{props.error}</span>
    </div>
  )
}

export default InputGroup
