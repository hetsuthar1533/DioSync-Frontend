import React from 'react'
import classNames from 'classnames'

function Paragraph({ children, className, text32, text24, text20, text18, text16, text14, text12, ...props }) {
  const classes = classNames({
    'md:text-[32px] sm:leading-[46px] text-[28px] leading-[40px] font-bold': text32,
    'sm:text-[24px] sm:leading-[36px] text-[22px] leading-[32px] font-bold': text24,
    'sm:text-[20px] sm:leading-[30px] text-[18px] leading-[28px] font-bold': text20,
    'sm:text-[18px] sm:leading-[28px] text-[14px] leading-[21px]': text18,
    'text-[16px] leading-[24px]': text16,
    'text-[14px] leading-[21px] font-semibold': text14,
    'text-[12px] leading-[17px]': text12,
  })
  return (
    <p className={`${classes} ${className ? className : ''}`} title={props?.title}>
      {children}
    </p>
  )
}

export default Paragraph
