import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { CgClose } from 'react-icons/cg'
import Paragraph from './typography/Paragraph'

function Modal({ open, onClose, header, children, ...props }) {
  // Event handler for keydown event
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  // Add and remove event listener when modal is open/closed
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])
  if (!open) return null

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 flex justify-center items-center transition-colors z-[25] bg-black/20'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-lg shadow sm:p-6 p-4 transition-all md:max-h-[calc(110vh-160px)] max-h-[calc(110vh-200px)] overflow-y-auto scale-100 opacity-100 m-3 ${props.width}`}
      >
        {header ? (
          <div className='flex items-center justify-between gap-4 md:mb-8 mb-6'>
            <Paragraph text20>{props.headingText}</Paragraph>
            <button
              onClick={onClose}
              className='rounded-lg text-grey-400 bg-white hover:bg-grey-500 hover:text-grey-600'
            >
              <CgClose size={20} />
            </button>
          </div>
        ) : (
          ''
        )}
        {children}
      </div>
    </div>)  
}

export default Modal
