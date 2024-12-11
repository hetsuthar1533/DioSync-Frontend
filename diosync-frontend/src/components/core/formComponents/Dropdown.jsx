import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import Modal from '../Modal'
import Logout from '../../../pages/authentication/Logout'

function Dropdown({ children, className, dropdownItems, withChevron, chevronColor, innerClasses }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }
  const closeDropdown = () => {
    setIsOpen(false)
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown()
    }
  }
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
    closeDropdown()
  }

  const handleLogoutClose = () => {
    setIsLogoutModalOpen(false)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className='relative' ref={dropdownRef}>
        <button type='button' className={className} onClick={toggleDropdown}>
          <div className={`flex items-center gap-3 ${innerClasses}`}>
            {children}{' '}
            {withChevron ? (
              <IoIosArrowDown
                size={18}
                color={chevronColor}
                className={`transition-all ${isOpen ? 'rotate-180' : ''}`}
              />
            ) : (
              ''
            )}
          </div>
        </button>

        {isOpen && (
          <div className='origin-top-right p-3 absolute right-0 mt-2 w-[238px] rounded-lg shadow-cardShadow bg-white z-10'>
            <ul role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
              {dropdownItems?.map((item, index) => {
                return item?.LinkName === 'Logout' ? (
                  <li className='mb-1' key={index}>
                    <a
                      href={item?.Link}
                      className='block px-3 py-[6px] text-sm text-site-black font-semibold rounded-lg hover:bg-light-grey'
                      onClick={(e) => {
                        e.preventDefault()
                        handleLogoutClick()
                      }}
                    >
                      {item?.LinkName}
                    </a>
                  </li>
                ) : (
                  <li className='mb-1' key={index}>
                    <a
                      href={item?.Link}
                      className='block px-3 py-[6px] text-sm text-site-black font-semibold rounded-lg hover:bg-light-grey'
                      onClick={closeDropdown}
                    >
                      {item?.LinkName}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
      {isLogoutModalOpen && <Logout handleLogoutClose={handleLogoutClose} isLogoutModalOpen={isLogoutModalOpen} />}
    </>
  )
}

export default Dropdown
