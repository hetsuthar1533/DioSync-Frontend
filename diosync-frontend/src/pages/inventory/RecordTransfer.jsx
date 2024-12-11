import React, { useEffect, useRef, useState } from 'react'
import InputType from '../../components/core/formComponents/InputType'
import Button from '../../components/core/formComponents/Button'
import { Field, Form, Formik } from 'formik'
import productImage from '../../assets/images/product_item_one.svg'
import Paragraph from '../../components/core/typography/Paragraph'
import SelectType from '../../components/core/formComponents/SelectType'
import FormLabel from '../../components/core/typography/FormLabel'
import ThemeDatePicker from '../../components/core/formComponents/ThemeDatePicker'
import TextArea from '../../components/core/formComponents/TextArea'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import ListItem from '../../components/themeComponents/ListItem'
import { useDispatch, useSelector } from 'react-redux'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { userSelector } from '../../redux/slices/userSlice'
import { GetVenueDropdownData } from '../../services/barOwnerService'
import { AddRecordTransfer, GetItemsForRecordTransfer } from '../../services/inventoryService'
import noImage from '../../assets/images/noImg.png'
import { GetAllUnitMeasure } from '../../services/unitMeasure'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { recordTransferValidationSchema } from '../../validations/owner/recordTransferValidationSchema'
import moment from 'moment'

function RecordTransfer({ onClose }) {
  const dispatch = useDispatch()
  const owner = useSelector(userSelector) //for ownwer
  const activeVenue = useSelector(activeVenueSelector)
  const dropdownRef = useRef(null)
  const [transferType, setTransferType] = useState('sending') // this is for the send and receive
  const [venueName, setVenueName] = useState()
  const [venueOptions, setVenueOptions] = useState([])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    from: activeVenue,
    to: '',
    date: '',
    note: '',
    transferLocation: '',
  })
  const [searchItem, setSearchItem] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [itemOptionData, setItemOptionData] = useState([])
  const [availableItemOption, setAvailableItemOption] = useState([])
  const [selectedItemData, setSelectedItemData] = useState([])
  const [showError, setShowError] = useState(false)
  const [unitMeasureOption, setUnitMeasureOption] = useState([])

  // useEffect(() => {
  //   if (unitMeasureOption?.length > 0) {
  //     setDefaultInitialValues((prev) => ({
  //       ...prev,
  //       transferLocation: unitMeasureOption[0]?.value,
  //     }))
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [unitMeasureOption])

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown()
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedItemData?.length > 0) {
      setShowError(false)
    }
  }, [selectedItemData])

  useEffect(() => {
    fetchAllUnitMeasure()
  }, [])

  useEffect(() => {
    fetchAllVenues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner?.id])

  useEffect(() => {
    if (activeVenue && activeVenue > 0) {
      getTheRecordItems(activeVenue)
    }
  }, [activeVenue])

  const fetchAllVenues = async () => {
    if (owner?.id) {
      const response = await GetVenueDropdownData(owner?.id)
      if (response?.data?.data) {
        const matchedVenue = response?.data?.data?.results?.find((data) => activeVenue === data?.id)
        if (matchedVenue) {
          setVenueName(matchedVenue?.name)
        } else {
          setVenueName('')
        }
        const formattedData = response?.data?.data?.results
          ?.filter((data) => data?.id !== activeVenue)
          ?.map((data) => {
            return { label: data?.name, value: data?.id }
          })
        setVenueOptions(formattedData)
      }
    }
  }

  const getTheRecordItems = async (activeVenue) => {
    const response = await GetItemsForRecordTransfer(activeVenue)
    if (response?.status === 200) {
      setAvailableItemOption(response?.data?.data)
      setItemOptionData(response?.data?.data)
    }
  }

  const toggleDropdown = (dropdown) => {
    setIsOpen((prevDropdown) => (prevDropdown === dropdown ? null : dropdown))
  }

  const closeDropdown = () => {
    setIsOpen(false)
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
        item?.id === id
          ? {
              ...item,
              selectedUnitOfMeasure: newValue,
            }
          : item,
      ),
    )
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    if (selectedItemData.length > 0) {
      const filteredData = selectedItemData?.map((item) => ({
        id: item?.id,
        unit_id: item?.selectedUnitOfMeasure,
        quantity: Number(item?.newQty),
      }))

      if (transferType === 'sending') {
        const params = {
          is_send: true,
          from_id: data?.from,
          send_id: data?.transferLocation,
          products: filteredData,
          date: moment(data?.date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          note: data?.note,
        }
        await handleSubmitRecordTransfer(params)
      } else {
        const params = {
          is_send: false,
          from_id: data?.transferLocation,
          send_id: data?.to,
          products: filteredData,
          date: moment(data?.date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          note: data?.note,
        }
        await handleSubmitRecordTransfer(params)
      }
    } else {
      setShowError(true)
    }
    dispatch(hideLoader())
  }

  const handleSubmitRecordTransfer = async (data) => {
    const response = await AddRecordTransfer(data)
    if (response?.status === 201) {
      onClose()
    }
  }

  return (
    <div>
      <Formik
        initialValues={defaultInitialValues}
        validationSchema={recordTransferValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form>
            <div className='grid grid-cols-12 sm:gap-4 gap-3'>
              <div className='col-span-12'>
                <div className='flex items-center gap-3 mb-4 flex-wrap sm:flex-no-wrap'>
                  <label
                    className='relative flex items-center rounded-full cursor-pointer w-full sm:w-auto'
                    htmlFor={'sending'}
                  >
                    <input
                      type='radio'
                      className='peer rounded-none opacity-0 w-full h-full absolute cursor-pointer'
                      id={'sending'}
                      name={'transfer'}
                      checked={transferType === 'sending'}
                      onChange={() => {
                        setTransferType('sending')
                        setFieldValue('from', activeVenue)
                        setFieldValue('to', null)
                      }}
                    />
                    <span className='block border py-2 px-4 border-medium-grey rounded-lg text-site-black peer-checked:bg-primary-blue peer-checked:text-white transition-all font-semibold text-center w-full sm:w-auto'>
                      Sending items
                    </span>
                  </label>
                  <Paragraph text16 className={'font-semibold w-full sm:w-auto text-center sm:text-start'}>
                    or
                  </Paragraph>
                  <label
                    className='relative flex items-center rounded-full cursor-pointer w-full sm:w-auto'
                    htmlFor={'sending'}
                  >
                    <input
                      type='radio'
                      className='peer rounded-none opacity-0 w-full h-full absolute cursor-pointer'
                      id={'receiving'}
                      name={'transfer'}
                      checked={transferType === 'receiving'}
                      onChange={() => {
                        setTransferType('receiving')
                        setFieldValue('from', null)
                        setFieldValue('to', activeVenue)
                      }}
                    />
                    <span className='block border py-2 px-4 border-medium-grey rounded-lg text-site-black peer-checked:bg-primary-blue peer-checked:text-white transition-all font-semibold text-center w-full sm:w-auto'>
                      Receiving items
                    </span>
                  </label>
                </div>
                {/* {transferType === 'sending' && (
                  <>
                    <Paragraph text14 className='mb-2'>
                      <span className='text-dark-grey'>From: </span>
                      {venueName ?? ''}
                    </Paragraph>
                    <div className='flex items-center mb-4'>
                      <Paragraph text14 className='text-dark-grey'>
                        To:{' '}
                      </Paragraph>

                      <Field
                        as='select'
                        name='transferLocation'
                        className='border-0 outline-none text-sm font-semibold text-site-black w-auto'
                        value={values?.transferLocation}
                        onBlur={handleBlur}
                        onChange={(event) => setFieldValue('transferLocation', event.target.value)}
                      >
                        <option value='' disabled>
                          Choose transfer location
                        </option>
                        {venueOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </>
                )}
                {transferType === 'receiving' && (
                  <>
                    <div className='flex items-center mb-4'>
                      <Paragraph text14 className='text-dark-grey'>
                        From:{' '}
                      </Paragraph>
                      <Field
                        as='select'
                        name='transferLocation'
                        className='border-0 outline-none text-sm font-semibold text-site-black w-auto'
                        onBlur={handleBlur}
                        value={values?.transferLocation}
                        onChange={(event) => setFieldValue('transferLocation', event.target.value)}
                      >
                        <option value='' disabled>
                          Choose transfer location
                        </option>
                        {venueOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <Paragraph text14 className='mb-2'>
                      <span className='text-dark-grey'>To: </span>
                      {venueName ?? ''}
                    </Paragraph>
                  </>
                )} */}
                {transferType === 'sending' && (
                  <>
                    <Paragraph text14 className='mb-2'>
                      <span className='text-dark-grey'>From: </span>
                      {venueName ?? ''}
                    </Paragraph>
                    <div className='mb-4'>
                      <div className='flex items-center '>
                        <Paragraph text14 className='text-dark-grey'>
                          To:
                        </Paragraph>

                        <Field
                          as='select'
                          name='transferLocation'
                          className='border-0 outline-none text-sm font-semibold text-site-black w-auto'
                          value={values.transferLocation}
                          onBlur={handleBlur}
                          onChange={(event) => setFieldValue('transferLocation', event.target.value)}
                        >
                          <option value='' disabled>
                            Choose transfer location
                          </option>
                          {venueOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                      {errors.transferLocation && touched.transferLocation ? (
                        <div className='text-site-red text-sm font-medium ml-6'>{errors.transferLocation}</div>
                      ) : null}
                    </div>
                  </>
                )}

                {transferType === 'receiving' && (
                  <>
                    <div className='mb-4'>
                      <div className='flex items-center'>
                        <Paragraph text14 className='text-dark-grey'>
                          From:
                        </Paragraph>
                        <Field
                          as='select'
                          name='transferLocation'
                          className='border-0 outline-none text-sm font-semibold text-site-black w-auto'
                          onBlur={handleBlur}
                          value={values.transferLocation}
                          onChange={(event) => setFieldValue('transferLocation', event.target.value)}
                        >
                          <option value='' disabled>
                            Choose transfer location
                          </option>
                          {venueOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                      {errors.transferLocation && touched.transferLocation ? (
                        <div className='text-site-red text-sm font-medium ml-10'>{errors.transferLocation}</div>
                      ) : null}
                    </div>
                    <Paragraph text14 className='mb-2'>
                      <span className='text-dark-grey'>To: </span>
                      {venueName ?? ''}
                    </Paragraph>
                  </>
                )}
              </div>
              <div className='col-span-12'>
                <SearchFilter
                  setSearchItem={setSearchItem}
                  searchItem={searchItem}
                  placeholder={'Search'}
                  className={'w-full'}
                  iconRight
                  onClick={() => toggleDropdown('search_items')}
                />
                {showError && <div className='text-site-red text-sm font-medium'>{'Item is required'}</div>}
                {isOpen === 'search_items' && (
                  <div
                    className='origin-top-right p-5 absolute -right-2 top-[255px] mt-5 sm:w-full w-[240px] rounded-lg shadow-cardShadow bg-white z-10 '
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
                                key={index}
                                defaultItem
                                {...(!isLastItem && { borderBottom: true })}
                                className='mb-2'
                                itemName={item?.item_name}
                                currency={'$'}
                                subDetail={subDetail}
                                price={item?.sell_price}
                                productImage={item?.item_image ?? noImage}
                                onClick={() => handleSelectedItem(item)}
                                imgSize={'42px'}
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
                        <Paragraph text14>{item?.item_name}</Paragraph>
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
                  name='date'
                  placeholder='Select date and time'
                  selected={values.date}
                  onChange={(date) => setFieldValue('date', date)}
                  dateFormat={'MMMM d, yyyy h:mm aa'}
                  showTimeSelect
                ></ThemeDatePicker>
                {errors?.date && <div className='text-site-red text-sm font-medium'>{errors?.date}</div>}
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

export default RecordTransfer
