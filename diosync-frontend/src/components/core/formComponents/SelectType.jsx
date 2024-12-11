import React, { useEffect, useRef, useState } from 'react'

// Icon component
const Icon = ({ isOpen }) => (
  <svg
    viewBox='0 0 24 24'
    width='18'
    height='18'
    stroke='#222'
    strokeWidth='1.5'
    fill='none'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={isOpen ? 'translate' : ''}
  >
    <polyline points='6 9 12 15 18 9'></polyline>
  </svg>
)

// CloseIcon component
const CloseIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width='14'
    height='14'
    stroke='#919297'
    strokeWidth='2'
    fill='none'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <line x1='18' y1='6' x2='6' y2='18'></line>
    <line x1='6' y1='6' x2='18' y2='18'></line>
  </svg>
)

// CustomSelect component
const SelectType = ({
  placeholder,
  error,
  options,
  isMulti,
  isSearchable,
  onChange,
  sm,
  xs,
  value,
  fullWidth,
  disabled,
  isOptional = false,
  ...props
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || (isMulti ? [] : placeholder ? null : options[0]))
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef()
  const inputRef = useRef()
  const measureRef = useRef(null)
  const [selectWidth, setSelectWidth] = useState('auto')
  const [preventClose, setPreventClose] = useState(false)

  useEffect(() => {
    setSearchValue('')
    if (showMenu && searchRef.current) {
      searchRef.current.focus()
    }
  }, [showMenu])

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        // Delay the menu closing to allow onItemClick to process
        setTimeout(() => {
          setShowMenu(false)
        }, 200)
      }
    }

    window.addEventListener('mousedown', handler)
    return () => {
      window.removeEventListener('mousedown', handler)
    }
  }, [inputRef])

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  useEffect(() => {
    const widths = options?.map((option) => {
      measureRef.current.innerText = option.label
      return measureRef.current.clientWidth
    })
    const maxWidth = Math.max(...widths)
    setSelectWidth(maxWidth + 32)
  }, [options])

  const handleInputClick = (e) => {
    setShowMenu(!showMenu)
  }

  const getDisplay = () => {
    if (!selectedValue || selectedValue?.length === 0) {
      return placeholder || options[0]?.label
    }
    if (isMulti) {
      return (
        <div className='flex flex-wrap gap-1'>
          {selectedValue?.map((option, index) => (
            <div
              key={`${option?.value}-${index}`}
              className={`bg-light-grey text-site-black font-medium text-xs px-1 rounded-md flex items-center gap-1 py-1`}
            >
              {option.label}
              <span onClick={(e) => onTagRemove(e, option)} className='flex item-center'>
                <CloseIcon />
              </span>
            </div>
          ))}
        </div>
      )
    }
    return <div className='truncate'>{selectedValue.label}</div>
  }

  const removeOption = (option) => selectedValue?.filter((o) => o.value !== option.value)

  const onTagRemove = (e, option) => {
    e.stopPropagation()
    const newValue = removeOption(option)
    setSelectedValue(newValue)
    onChange(newValue)
  }

  // const onItemClick = (option) => {
  //   let newValue
  //   if (isMulti) {
  //     if (selectedValue?.findIndex((o) => o.value === option.value) >= 0) {
  //       newValue = removeOption(option)
  //     } else {
  //       newValue = [...selectedValue, option]
  //     }
  //   } else {
  //     newValue = option
  //   }
  //   setSelectedValue(newValue)
  //   onChange(newValue)
  //   setShowMenu(false) // Close the menu on item select
  //   console.log('value', value)
  // }

  const onItemClick = (option, e) => {
    e.stopPropagation()
    setPreventClose(true) // Set flag to prevent closing
    let newValue
    if (isMulti) {
      if (selectedValue?.findIndex((o) => o.value === option.value) >= 0) {
        newValue = removeOption(option)
      } else {
        newValue = [...selectedValue, option]
      }
    } else {
      newValue = option
    }
    setSelectedValue(newValue)
    onChange(newValue)
    setTimeout(() => {
      if (!preventClose) {
        setShowMenu(false)
      }
    }, 0)
  }

  useEffect(() => {
    if (preventClose) {
      setPreventClose(false) // Reset flag after handling
    }
  }, [showMenu])

  const isSelected = (option) => {
    if (isMulti) {
      return selectedValue?.filter((o) => o.value === option.value).length > 0
    }

    if (!selectedValue) {
      return false
    }
    return selectedValue?.value === option?.value
  }

  const onSearch = (e) => {
    setSearchValue(e.target.value)
  }

  const getOptions = () => {
    if (!searchValue) {
      return options
    }

    return options?.filter((option) => option?.label?.toLowerCase()?.indexOf(searchValue.toLowerCase()) >= 0)
  }

  return (
    <div
      className={`relative cursor-pointer ${fullWidth ? '!w-full' : ''} max-[767px]:!w-full`}
      style={{ width: selectWidth + 12 }}
    >
      <div
        ref={inputRef}
        onClick={handleInputClick}
        className={`${
          sm
            ? 'xxl:py-[7px] py-[10px] px-4 gap-2'
            : xs
              ? 'xxl:py-[3px] py-[5px] px-[10px] gap-1'
              : 'xxl:py-[11px] py-[13px] px-4 gap-2'
        } flex items-center justify-between  border border-medium-grey rounded-lg ${props.className ? props.className : ''} ${disabled ? 'pointer-events-none' : ''}`}
      >
        <div
          className={`font-semibold truncate ${xs ? 'text-sm leading-6' : 'text-sm leading-6'}  ${
            !selectedValue || selectedValue?.length === 0 ? 'placeholder text-dark-grey' : 'text-site-black'
          } ${props?.fontSize ? props?.fontSize : ''}`}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {getDisplay()}
        </div>
        <div className='dropdown-tools'>
          <div className='dropdown-tool'>
            <Icon isOpen={showMenu} />
          </div>
        </div>
      </div>

      {showMenu && (
        <div
          className={`w-full px-4 pt-3 pb-2 absolute translate-y-[6px] rounded-md overflow-auto bg-white z-[10] max-h-[300px] min-h-[50px] shadow-cardShadow `}
        >
          {isSearchable && (
            <div className='px-2 pb-[8px]'>
              <input
                className={`w-full border rounded-lg border-medium-grey py-[6px] ps-[48px] pe-3 focus:outline-0 placeholder:text-dark-grey placeholder:font-semibold placeholder:text-sm bg-search-icon-grey bg-no-repeat bg-[left_16px_top_8px] `}
                onChange={onSearch}
                value={searchValue}
                ref={searchRef}
                type='search'
                placeholder='Search here'
              />
            </div>
          )}
          {isOptional && (
            <div
              onClick={(e) => onItemClick({ label: '', value: null }, e)}
              key={0}
              className={`px-3 py-2 cursor-pointer transition-all duration-300 ease rounded-md text-sm font-semibold text-site-black hover:bg-light-grey hover:text-site-black ${
                isSelected({ label: '', value: null }) && 'bg-light-grey text-site-black font-semibold'
              } ${props?.fontSize}`}
            >
              {'Select'}
            </div>
          )}
          {getOptions()?.map((option) => (
            <div
              onClick={(e) => onItemClick(option, e)}
              key={option?.value}
              className={`px-3 py-2 cursor-pointer transition-all duration-300 ease rounded-md text-sm font-semibold text-site-black hover:bg-light-grey hover:text-site-black ${
                isSelected(option) && 'bg-light-grey text-site-black font-semibold'
              } ${props?.fontSize}`}
            >
              {option?.label}
            </div>
          ))}
        </div>
      )}
      <div ref={measureRef} className='absolute invisible whitespace-nowrap px-3 py-[6px] font-semibold text-sm'></div>
      {error && <div className='text-site-red text-sm font-medium'>{error}</div>}
    </div>
  )
}

export default SelectType
