import React from 'react'
import classNames from 'classnames'

function Checkbox({ name, id, children, className, w18, w15, ...rest }) {
  const classes = classNames(
    "before:content[''] peer relative cursor-pointer appearance-none rounded-[2px] border border-medium-grey transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-primary-blue checked:bg-primary-blue checked:before:bg-primary-blue",
    {
      'lg:w-[18px] lg:h-[18px] h-4 w-4': w18,
      'w-[16px] h-[16px]': w15,
    },
  )
  return (
    <div className={`inline-flex items-center gap-3 ${className ? className : ''}`}>
      <label className='relative inline-flex items-center rounded-full cursor-pointer' htmlFor={id}>
        <input type='checkbox' className={`${classes}`} id={id} name={name} {...rest} />
        <span className='absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={'w-[12px] h-[12px]'}
            viewBox='0 0 20 20'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='1'
          >
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            ></path>
          </svg>
        </span>
      </label>
      <label className='inline-block text-site-black cursor-pointer text-sm font-semibold select-none' htmlFor={id}>
        {children}
      </label>
    </div>
  )
}

export default Checkbox
