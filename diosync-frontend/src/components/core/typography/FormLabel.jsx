import React from 'react'
import { capitalizeFunction } from '../../../utils/commonHelper'

function FormLabel({ className, children, ...props }) {
  return (
    <label
      {...props}
      className={`sm:text-base sm:leading-6 text-sm leading-[22px] text-site-black block mb-2 font-semibold ${
        className ? className : ''
      }`}
    >
      {capitalizeFunction(children)}
    </label>
  )
}

export default FormLabel
