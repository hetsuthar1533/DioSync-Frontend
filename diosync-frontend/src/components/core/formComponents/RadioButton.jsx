import React from 'react'

function RadioButton({ name, id, children, className, ...props }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <label className='relative flex items-center rounded-full cursor-pointer' htmlFor={id}>
        <input
          type='radio'
          className="before:content[''] peer relative lg:w-6 lg:h-6 h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-medium-grey transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-3 before:w-3 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-primary-blue "
          id={id}
          name={name}
          {...props}
        />
        <span className='absolute block lg:w-[17px] lg:h-[17px] w-[10px] h-[10px] rounded-full peer-checked:bg-primary-blue text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100'></span>
      </label>
      <label
        className={`text-site-black cursor-pointer text-base font-semibold leading-6 select-none ${props.labelClass}`}
        htmlFor={id}
      >
        {children}
      </label>
    </div>
  )
}

export default RadioButton
