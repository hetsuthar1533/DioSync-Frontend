import React from 'react'

function ToolTip({ tooltip, position, children }) {
  return (
    <div className='group relative inline-block'>
      {children}
      <span
        className={`invisible tooltip-text group-hover:visible opacity-0 group-hover:opacity-100 transition rounded-lg absolute bg-white px-2 py-1 text-[10px] leading-[18px] font-semibold text-site-black w-max  drop-shadow-[0_4px_24px_rgba(0,0,0,0.1)] z-[1] text-nowrap 
        ${
          position === 'top center'
            ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
            : position === 'top right'
              ? 'bottom-full -right-4 mb-2'
              : position === 'bottom center'
                ? 'top-full left-1/2 -translate-x-1/2 mb-2'
                : 'top-full -right-4 mt-2'
        }  `}
      >
        {tooltip}
        <span
          className={`absolute  w-5 h-5 bg-white rotate-45 block -z-[1] 
          ${
            position === 'top center'
              ? '-bottom-1 right-0 left-0 mx-auto'
              : position === 'top right'
                ? '-bottom-1 right-[16px]'
                : position === 'bottom center'
                  ? '-top-[4px] right-0 left-0 mx-auto'
                  : '-top-[4px] right-[16px]'
          }`}
        ></span>
      </span>
    </div>
  )
}

export default ToolTip
