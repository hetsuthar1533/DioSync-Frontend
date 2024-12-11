import React from 'react'
import classNames from 'classnames'
import Paragraph from '../core/typography/Paragraph'
import noImage from '../../assets/images/noImg.png'
import { PiArrowDownBold, PiArrowUpBold } from 'react-icons/pi'
import { FiDollarSign } from 'react-icons/fi'
import { GrCart } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import { useSelector } from 'react-redux'

function ListItem({
  className,
  defaultItem,
  withBorder,
  borderBottom,
  positive,
  negative,
  neutral,
  cart,
  withCount,
  qty,
  price,
  currency,
  imgSize,
  noImg,
  subDetail,
  percent,
  pillValueLink,
  ...props
}) {
  const { generalData } = useSelector(generalDataSelector)
  const classes = classNames({
    'py-[6px] sm:px-4 px-3': defaultItem,
    'border border-medium-grey sm:px-4 px-3 py-3 rounded-lg': withBorder,
    'border-b border-medium-grey': borderBottom,
  })
  const pillsClasses = classNames({
    'bg-site-green/10 text-site-green': positive,
    'bg-site-red/10 text-site-red': negative,
    'bg-primary-blue/10 text-primary-blue': neutral,
  })
  return (
    <div
      {...props}
      className={`${classes} flex justify-between gap-3 ${
        currency === 'AED' ? 'items-end' : 'items-center'
      } ${props.onClick ? 'cursor-pointer' : 'cursor-auto'}  ${className ? className : ''}`}
    >
      <div className='flex items-center gap-3 overflow-x-auto'>
        {(withCount || props?.productImage) && (
          <div className='flex items-center gap-1 flex-shrink-0'>
            {props?.count ? <Paragraph text14>{props?.count}</Paragraph> : ''}
            {props.productImage && !noImg && (
              <img
                src={props?.productImage ? props?.productImage : noImage}
                alt='productImg'
                width={imgSize ? imgSize : '32px'}
                height={imgSize ? imgSize : '32px'}
                style={{ height: imgSize ? imgSize : '32px', objectFit: 'contain' }}
              />
            )}
          </div>
        )}
        <div>
          <Paragraph
            className={`${props.fontSize ? props.fontSize : 'text-sm leading-[21px]'} font-semibold truncate xxl:max-w-[140px] lg:max-w-[80px] sm:max-w-[150px] max-w-[120px]`}
            title={props?.itemName}
          >
            {props?.itemName}
          </Paragraph>
          {qty ? <span className='text-sm leading-[21px] font-semibold text-dark-grey'>QTY: {qty}</span> : ''}
          {subDetail ? <span className='text-xs leading-[18px] font-semibold text-dark-grey'>{subDetail}</span> : ''}
        </div>
      </div>
      {percent && (
        <div className='bg-site-green/10 text-site-green flex items-center justify-center py-1 px-2 gap-[3px] rounded-lg text-sm leading-[21px] font-semibold'>
          {percent}
        </div>
      )}
      {props.pillValue && (
        <div
          className={`${pillsClasses} flex items-center justify-center py-1 px-2 gap-[3px] rounded-lg text-sm leading-[21px] font-semibold `}
        >
          <Link
            to={pillValueLink ?? '#'}
            className={`flex items-center justify-center gap-[3px] rounded-lg text-sm leading-[21px] font-semibold`}
          >
            {positive ? (
              <PiArrowUpBold size={16} />
            ) : neutral ? (
              generalData?.currency ?? ''
            ) : cart ? (
              <GrCart size={14} />
            ) : (
              <PiArrowDownBold size={16} />
            )}{' '}
            {props?.pillValue}
          </Link>
        </div>
      )}

      {price && (
        <Paragraph className={`${props.fontSize ? props.fontSize : 'text-sm leading-[21px]'} font-semibold mb-[4px]`}>
          {currency}{' '}
          <span
            className={
              currency !== 'AED' ? 'text-dark-grey text-sm leading-[21px]' : 'text-site-black text-sm leading-[21px] '
            }
          >
            {price}
          </span>
        </Paragraph>
      )}
    </div>
  )
}

export default ListItem
