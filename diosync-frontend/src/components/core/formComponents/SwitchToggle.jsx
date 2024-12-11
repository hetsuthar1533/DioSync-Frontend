import React from 'react'

function SwitchToggle({ id, children, leftLabel, rightLabel, onChange, isChecked, disabled, ...props }) {
  const handleChange = async () => {
    if (onChange) {
      await onChange(!isChecked)
    }
  }
  return (
    <div className='flex items-center gap-3'>
      <span className=' text-base leading-6 font-semibold text-site-black'>{leftLabel}</span>
      <label className='inline-flex items-center cursor-pointer' htmlFor={id}>
        <input
          type='checkbox'
          className='sr-only peer'
          onChange={handleChange}
          checked={isChecked}
          disabled={disabled}
        />{' '}
        <div
          className="relative w-8 h-4 bg-dark-grey rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[-2px] after:start-[-4px] after:bg-white after:border-dark-grey after:border after:rounded-full 
      after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-blue"
        ></div>
      </label>
      <span className=' text-base leading-6 font-semibold text-site-black'>{rightLabel}</span>
    </div>
  )
}

export default SwitchToggle
