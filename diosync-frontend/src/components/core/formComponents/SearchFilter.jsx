import React from 'react'

function SearchFilter({ setSearchItem, searchItem, className, setItemOffset, iconRight, sm, ...props }) {
  return (
    <input
      {...props}
      type={'search'}
      placeholder={props.placeholder}
      value={searchItem}
      onChange={(e) => {
        if (e.target.value.trim().length > 0 || e.target.value === '') {
          setSearchItem(e.target.value)
        }
      }}
      autoComplete='cc-given-name'
      className={`outline-none m-0 bg-search-icon bg-no-repeat ${iconRight && sm ? 'bg-[right_16px_top_8px] pe-[48px] ps-3' : iconRight ? 'bg-[right_16px_top_12px] pe-[48px] ps-3' : sm ? 'bg-[left_16px_top_8px]' : 'bg-[left_16px_top_12px] ps-[48px] pe-3'}  rounded-lg border border-medium-grey ${sm ? 'py-[7px]' : 'py-[11px]'} text-sm leading-6 font-semibold focus:outline-0 focus:border-dark-grey placeholder:text-dark-grey placeholder:font-semibold text-site-black ${className}`}
    />
  )
}

export default SearchFilter
