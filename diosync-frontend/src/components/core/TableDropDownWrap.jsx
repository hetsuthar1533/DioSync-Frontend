import React from 'react'
import ReactDOM from 'react-dom'

function TableDropDownWrap({ open, dropdownRef, children, ...props }) {
  if (!open) return null
  return ReactDOM.createPortal(
    <div className='fixed inset-0 flex justify-center items-center transition-colors z-[25]'>
      <div ref={dropdownRef}>{children}</div>
    </div>,
    document.getElementById('modal-root'),
  )
}

export default TableDropDownWrap
