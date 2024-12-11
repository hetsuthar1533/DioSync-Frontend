import React, { useEffect, useRef, useState } from 'react'
import InputType from '../../components/core/formComponents/InputType'
import Button from '../../components/core/formComponents/Button'
import { Form, Formik } from 'formik'
import Paragraph from '../../components/core/typography/Paragraph'
import SelectType from '../../components/core/formComponents/SelectType'
import FormLabel from '../../components/core/typography/FormLabel'
import ThemeDatePicker from '../../components/core/formComponents/ThemeDatePicker'
import TextArea from '../../components/core/formComponents/TextArea'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import { useDispatch, useSelector } from 'react-redux'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import {
  AddRecordBreakage,
  GetAllEmployees,
  GetAllRecordBreakageReasons,
  GetItemsForRecordTransfer,
} from '../../services/inventoryService'
import ListItem from '../../components/themeComponents/ListItem'
import { GetAllUnitMeasure } from '../../services/unitMeasure'
import noImage from '../../assets/images/noImg.png'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { recordBreakageValidationSchema } from '../../validations/owner/recordeBreakageValidationSchema'
import moment from 'moment'

function RecordBreakage({ onClose }) {
  const dispatch = useDispatch()
  const dropdownRef = useRef(null)
  const activeVenue = useSelector(activeVenueSelector)
  const [searchItem, setSearchItem] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [unitMeasureOption, setUnitMeasureOption] = useState([])
  const [itemOptionData, setItemOptionData] = useState([])
  const [availableItemOption, setAvailableItemOption] = useState([])
  const [showError, setShowError] = useState(false)
  const [selectedItemData, setSelectedItemData] = useState([])

  const [recordBreakageOption, setRecordBreakageOption] = useState([])
  const [employeeOption, setEmployeeOption] = useState([])

  useEffect(() => {
    if (selectedItemData?.length > 0) {
      setShowError(false)
    }
  }, [selectedItemData])

  useEffect(() => {
    fetchAllUnitMeasure()
    getAllRecordBreakageReason()
  }, [])

  useEffect(() => {
    if (activeVenue && activeVenue > 0) {
      getAllEmployee(activeVenue)
      getTheRecordItems(activeVenue)
    }
  }, [activeVenue])
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown()
    }
  }

  const toggleDropdown = (dropdown) => {
    setIsOpen((prevDropdown) => (prevDropdown === dropdown ? null : dropdown))
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const getTheRecordItems = async (activeVenue) => {
    const response = await GetItemsForRecordTransfer(activeVenue)
    if (response?.status === 200) {
      setAvailableItemOption(response?.data?.data)
      setItemOptionData(response?.data?.data)
    }
  }

  const fetchAllUnitMeasure = async () => {
    try {
      const response = await GetAllUnitMeasure()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((unit) => ({
          label: unit.name,
          value: unit.id,
        }))
        setUnitMeasureOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const handleSelectedItem = (item) => {
    setSelectedItemData((prev) => [
      ...prev,
      {
        ...item,
        newQty: 1,
        selectedUnitOfMeasure: unitMeasureOption[0]?.value,
      },
    ])
    const selectedIds = selectedItemData?.map((item) => item.id)
    const remainingItems = itemOptionData?.filter((item) => !selectedIds.includes(item.id))
    const availableItems = remainingItems?.filter((option) => item?.id !== option?.id)
    setAvailableItemOption(availableItems)
    closeDropdown()
  }

  const handleQtyChange = (id, newQty) => {
    setSelectedItemData((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              newQty: newQty,
            }
          : item,
      ),
    )
  }

  const handleUnitOfMeasureChange = (id, newValue) => {
    setSelectedItemData((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              selectedUnitOfMeasure: newValue,
            }
          : item,
      ),
    )
  }

  const getAllRecordBreakageReason = async () => {
    const response = await GetAllRecordBreakageReasons()
    if (response?.data?.status === 200) {
      const formattedData = response?.data?.data.map((reason) => ({
        label: reason.name,
        value: reason.id,
      }))
      setRecordBreakageOption(formattedData)
    }
  }
  const getAllEmployee = async (activeVenue) => {
    if (activeVenue > 0) {
      const response = await GetAllEmployees(activeVenue)
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((employee) => ({
          label: employee.name,
          value: employee.id,
        }))
        setEmployeeOption(formattedData)
      }
    }
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    if (selectedItemData?.length > 0) {
      const filteredData = selectedItemData?.map((item) => ({
        item: item?.id,
        unit_of_measure: item?.selectedUnitOfMeasure,
        qty: Number(item?.newQty),
      }))
      const paramsData = {
        bar_vanue: activeVenue,
        products: filteredData,
        breakage_date_time: moment(data?.date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        breakage_type: data?.type,
        employee: data?.employee,
        note: data?.note,
      }
      const response = await AddRecordBreakage(paramsData)
      if (response?.status === 201) {
        onClose()
      }
    } else {
      setShowError(true)
    }
    dispatch(hideLoader())
  }

  return (
    <div>
      <Formik
        initialValues={{ date: '', type: '', employee: '', note: '' }}
        validationSchema={recordBreakageValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12'>
                <SearchFilter
                  setSearchItem={setSearchItem}
                  searchItem={searchItem}
                  placeholder={'Search in the Inventory'}
                  className={'w-full'}
                  iconRight
                  onClick={() => toggleDropdown('search_items')}
                />
                {showError && <div className='text-site-red text-sm font-medium'>{'Item is required'}</div>}
                {isOpen === 'search_items' && (
                  <div
                    className='origin-top-right p-5 absolute -right-2 mt-5 sm:w-full w-[240px] rounded-lg shadow-cardShadow bg-white z-10 '
                    ref={dropdownRef}
                  >
                    <div className='z-0 flex items-center justify-between gap-3 pb-1 relative before:border-transparent before:border-r-[12px] before:border-l-[12px] before:border-b-[16px] before:border-b-white before:absolute before:-top-8 before:-right-1 before:-z-[1]'>
                      <Paragraph text14 className={'text-dark-grey font-semibold'}>
                        From Item ( {availableItemOption?.length ?? 0} )
                      </Paragraph>
                    </div>

                    <div className='border border-medium-grey rounded-lg max-h-[280px] overflow-y-auto '>
                      {Array.isArray(availableItemOption) &&
                        availableItemOption
                          ?.filter((option) => option?.item_name?.toLowerCase().includes(searchItem?.toLowerCase()))
                          ?.map((item, index) => {
                            const isLastItem = index === availableItemOption?.length - 1
                            const subDetail = item?.category ? `${item?.category}` : ''
                            return (
                              <ListItem
                                key={`${index + `item`}`}
                                defaultItem
                                {...(!isLastItem && { borderBottom: true })}
                                className='mb-0'
                                itemName={item?.item_name}
                                currency={'$'}
                                subDetail={subDetail}
                                price={item?.sell_price}
                                productImage={item?.item_image ?? noImage}
                                onClick={() => handleSelectedItem(item)}
                              />
                            )
                          })}
                    </div>
                  </div>
                )}
              </div>
              {selectedItemData?.map((item) => (
                <div className='md:col-span-6 col-span-12'>
                  <div className='rounded-lg border border-medium-grey md:p-4 px-4 py-3 flex item-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={item?.item_image ? item?.item_image : noImage}
                        alt='productImg'
                        className='w-8 h-8 flex-shrink-0 hidden md:block'
                      />
                      <div>
                        <Paragraph text14>{item?.item_name} </Paragraph>
                        <Paragraph text12 className={'text-dark-grey'}>
                          {item?.category}
                        </Paragraph>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <SelectType
                        xs
                        onChange={(option) => {
                          handleUnitOfMeasureChange(item.id, option?.value)
                        }}
                        options={unitMeasureOption}
                        placeholder={'Unit of measure'}
                        value={unitMeasureOption?.find((option) => option?.value === item?.selectedUnitOfMeasure)}
                      />
                      <input
                        type='number'
                        className={
                          'appearance-none rounded-lg border border-medium-grey py-[11px] text-sm leading-6 font-semibold w-full focus:outline-0 focus:border-dark-grey placeholder:text-dark-grey placeholder:font-semibold text-site-black px-4 !py-[3px] !px-2 max-w-11 text-xs'
                        }
                        defaultValue={1}
                        min={1}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        value={item?.qty}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className='col-span-12'>
                <FormLabel>Date & Time</FormLabel>
                <ThemeDatePicker
                  placeholder='Select date and time'
                  selected={values.date}
                  onChange={(date) => setFieldValue('date', date)}
                  dateFormat={'MMMM d, yyyy h:mm aa'}
                  showTimeSelect
                  maxDate={new Date()}
                ></ThemeDatePicker>
                {errors?.date && <div className='text-site-red text-sm font-medium'>{errors?.date}</div>}
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Type</FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={recordBreakageOption}
                  placeholder={'Select'}
                  error={errors?.type}
                  onChange={(option) => setFieldValue('type', option?.value)}
                  value={recordBreakageOption?.find((option) => option?.value === values?.type) || ''}
                />
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Employee</FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={employeeOption}
                  placeholder={'Select'}
                  error={errors?.employee}
                  onChange={(option) => setFieldValue('employee', option?.value)}
                  value={employeeOption?.find((option) => option?.value === values?.employee) || ''}
                />
              </div>
              <div className='col-span-12'>
                <FormLabel>Note</FormLabel>
                <TextArea
                  name='note'
                  placeholder={'Nathan fall down yesterday and broke ane bottle of hendricks 1l.'}
                />
              </div>
              <div className='col-span-12'>
                <div className='flex items-center justify-end gap-4'>
                  <Button onClick={onClose} secondary className={'w-full md:w-auto'}>
                    Cancel
                  </Button>
                  <Button type='submit' primary disabled={isSubmitting} className={'w-full md:w-auto'}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RecordBreakage
