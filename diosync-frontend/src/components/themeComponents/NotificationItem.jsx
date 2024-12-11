import React from 'react'
import { CgClose } from 'react-icons/cg'
import IconInfo from '../../assets/images/icon_info_blue.svg'
import IconFeelGood from '../../assets/images/icon_feelgood_red.svg'
import IconPie from '../../assets/images/icon_pie_green.svg'
import IconInventory from '../../assets/images/icon_inventory_orange.svg'
import IconGraph from '../../assets/images/icon_bar_blue.svg'
import Paragraph from '../core/typography/Paragraph'
import { timeDifference } from '../../utils/commonHelper'
import ToolTip from '../core/ToolTip'

function NotificationItem({ className, type, info, description, date, ...props }) {
  const isTruncated = description?.length > 35
  const displayText = isTruncated ? `${description?.slice(0, 35)}...` : description

  return (
    <div
      key={props?.key}
      className={`px-3 py-2 border-l-2 flex items-center justify-start gap-2 mb-1 rounded-se-[4px] rounded-ee-[4px]
    ${type === 'danger' ? 'bg-site-red/5 border-site-red' : type === 'success' ? 'bg-site-green/5 border-site-green' : type === 'warning' ? 'bg-site-yellow/5 border-site-yellow' : 'bg-primary-blue/5 border-primary-blue'} 
    ${className ? className : ''}`}
    >
      <div
        className={`w-7 flex-shrink-0 h-7 rounded-lg flex items-center justify-center ${type === 'danger' ? 'bg-site-red/5' : type === 'success' ? 'bg-site-green/5' : type === 'warning' ? 'bg-site-yellow/5' : 'bg-primary-blue/5'}`}
      >
        <img
          src={
            type === 'danger'
              ? IconFeelGood
              : type === 'success'
                ? IconPie
                : type === 'warning'
                  ? IconInventory
                  : IconInfo
          }
          alt='notified-icon'
        />
      </div>
      <div>
        <Paragraph text14 className={'xl:line-clamp-none line-clamp-1'}>
          {info}
        </Paragraph>

        {/* <ToolTip tooltip={description}> */}
        {description ? (
          <span className='text-sm leading-[21px] font-semibold text-dark-grey hide-text-overflow'>{displayText}</span>
        ) : (
          ''
        )}
        {/* </ToolTip> */}
      </div>
      {date && <span className='justify-self-end ms-auto'>{timeDifference(date)}</span>}
    </div>
  )
}

export default NotificationItem
