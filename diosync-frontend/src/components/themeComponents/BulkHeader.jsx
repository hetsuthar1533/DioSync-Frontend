import Reacr, { useState } from 'react'
import { tableFilter } from '../../constants/roleConstants'
import Button from '../core/formComponents/Button'
import { FiPlus } from 'react-icons/fi'
import SearchFilter from '../core/formComponents/SearchFilter'
import SelectType from '../core/formComponents/SelectType'

function BulkHeader({
  addName,
  handleAddFun,
  selectedIds,
  searchItem,
  setSearchItem,
  handleSelectAction,
  selectedAction,
  handleApplyAction,
}) {
  return (
    <>
      <div className='md:col-span-6 col-span-12'>
        {/* <SearchFilter
          setSearchItem={setSearchItem}
          searchItem={searchItem}
          placeholder={'Search'}
          className={'sm:w-auto w-full'}
          iconRight
          sm
        /> */}
      </div>
      <div className='md:col-span-6 col-span-12'>
        <div className='flex items-center justify-end sm:flex-nowrap flex-wrap sm:gap-4 gap-3'>
          {/* <SelectType
            sm
            options={tableFilter}
            placeholder={'select'}
            onChange={(option) => handleSelectAction(option?.value)}
            value={tableFilter?.find((option) => option?.value === selectedAction) || ''}
          ></SelectType> */}
          {/* <Button primary onClick={handleApplyAction} disabled={!selectedIds?.length > 0 || !selectedAction}>
            Apply
          </Button> */}
          <Button primary onClick={handleAddFun}>
            <FiPlus fontSize={'18px'} />
            {addName}
          </Button>
        </div>
      </div>
    </>
  )
}

export default BulkHeader
