import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import FormLabel from '../../components/core/typography/FormLabel'
import InputType from '../../components/core/formComponents/InputType'
import SelectType from '../../components/core/formComponents/SelectType'
import InputGroup from '../../components/core/formComponents/InputGroup'
import Button from '../../components/core/formComponents/Button'
import { FiDollarSign } from 'react-icons/fi'
import { avgDeliveryDaysOptions, dayOptions } from '../../constants/commonConstants'
import { GetAllCities, GetAllCountriesCode, GetAllStates } from '../../services/commonService'
import { addSupplierValidationSchema } from '../../validations/owner/addSupplierValidationSchema'
import { AddNewSupplier, UpdateSupplier } from '../../services/SupplierService'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

const AddSupplier = ({ selectedItem, getSupplierData, handleCloseModal }) => {
  const dispatch = useDispatch()
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const [cityOption, setCityOption] = useState([])
  const [stateOption, setStateOption] = useState([])
  const [countryCodeOption, setCountryCodeOption] = useState([])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    bar_venue: activeVenue,
    city: '',
    state: '',
    supplier_name: '',
    account_number: '',
    ofc_phone_number: '',
    ofc_phn_contry_code: '',
    website: '',
    internal_account_id: '',
    address: '',
    zip_code: '',
    representative_name: '',
    email: '',
    cell_phone_number: '',
    cell_phn_contry_code: '',
    delivery_day: [],
    avg_delivery_date: '',
    min_order: 0,
  })

  useEffect(() => {
    fetchCities()
    fetchStates()
    fetchCountryCodes()
  }, [])
  const fetchCities = async () => {
    try {
      const response = await GetAllCities()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((city) => ({
          label: city.city_name,
          value: city.id,
        }))
        setCityOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  useEffect(() => {
    if (!selectedItem && countryCodeOption.length > 0) {
      setDefaultInitialValues((prev) => ({
        ...prev,
        ofc_phn_contry_code: countryCodeOption[0].value,
        cell_phn_contry_code: countryCodeOption[0].value,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCodeOption])

  const fetchStates = async () => {
    try {
      const response = await GetAllStates()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((state) => ({
          label: state.state_name,
          value: state.id,
        }))
        setStateOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const fetchCountryCodes = async () => {
    try {
      const response = await GetAllCountriesCode()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((country) => ({
          label: country.country_code,
          value: country.id,
        }))
        setCountryCodeOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        bar_venue: selectedItem?.bar_venue?.id,
        city: Number(selectedItem?.city?.id),
        state: selectedItem?.state?.id,
        supplier_name: selectedItem?.supplier_name,
        account_number: selectedItem?.account_number,
        ofc_phone_number: selectedItem?.ofc_phone_number,
        website: selectedItem?.website,
        internal_account_id: selectedItem?.internal_account_id,
        address: selectedItem?.address,
        zip_code: selectedItem?.zip_code,
        representative_name: selectedItem?.representative_name,
        email: selectedItem?.email,
        cell_phone_number: selectedItem?.cell_phone_number,
        delivery_day: String(selectedItem?.delivery_day),
        avg_delivery_date: Number(selectedItem?.avg_delivery_date),
        min_order: selectedItem?.min_order,
        ofc_phn_contry_code: selectedItem?.ofc_phn_contry_code?.id,
        cell_phn_contry_code: selectedItem?.cell_phn_contry_code?.id,
      })
    }
  }, [selectedItem])

  const handleCallListApi = () => {
    handleCloseModal()
    getSupplierData()
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    if (selectedItem?.id) {
      const newData = {
        ...data,
        delivery_day: String(data?.delivery_day),
        account_number: Number(data?.account_number) ? Number(data?.account_number) : null,
      }
      const response = await UpdateSupplier(newData, selectedItem?.id)
      if (response?.status === 200) {
        handleCallListApi()
      }
    } else {
      const newData = {
        ...data,
        delivery_day: String(data?.delivery_day),
        account_number: Number(data?.account_number) ? Number(data?.account_number) : null,
      }
      const response = await AddNewSupplier(newData)
      if (response?.status === 201) {
        handleCallListApi()
      }
    }
    dispatch(hideLoader())
  }

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={defaultInitialValues}
        validationSchema={addSupplierValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ values, errors, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-12 gap-4'>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Name of the distributor</FormLabel>
                <InputType placeholder={'Type Here'} name={'supplier_name'} onBlur={handleBlur} />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Account number (Optional)</FormLabel>
                <InputType placeholder={'Type Here'} name={'account_number'} onBlur={handleBlur} />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Office phone (Optional)</FormLabel>
                <div className='flex items-start'>
                  {/* this is for the coutry code */}
                  <div className='bg-light-grey px-4 py-[11px] border border-r-0 border-medium-grey rounded-ss-lg rounded-es-lg'>
                    <select
                      name='ofc_phn_contry_code'
                      value={values?.ofc_phn_contry_code}
                      onChange={(event) => {
                        setFieldValue('ofc_phn_contry_code', Number(event.target.value))
                      }}
                      className='font-sm leading-[21px] font-semibold bg-transparent'
                    >
                      {countryCodeOption.map((country) => (
                        <option key={country.value + 'ofc_phn_contry_code'} value={country?.value}>
                          {country?.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <InputType
                    type={'number'}
                    name={'ofc_phone_number'}
                    placeholder={'Type here'}
                    className={'rounded-ss-none rounded-es-none'}
                    onBlur={handleBlur}
                    showError={false}
                    fullWidth
                  />
                </div>
                <div className='text-site-red text-sm font-medium'>{errors?.ofc_phone_number}</div>
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Website (Optional)</FormLabel>
                <InputType placeholder={'Type Here'} type={'text'} name={'website'} onBlur={handleBlur} />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Internal accounting ID (Optional)</FormLabel>
                <InputType placeholder={'Type Here'} name={'internal_account_id'} onBlur={handleBlur} />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Address line (Optional)</FormLabel>
                <InputType placeholder={'Type Here'} name={'address'} onBlur={handleBlur} />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>City</FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={cityOption}
                  placeholder={'Select'}
                  error={errors?.city}
                  onChange={(option) => setFieldValue('city', option?.value)}
                  value={cityOption?.find((option) => option?.value === values?.city)}
                />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>State</FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={stateOption}
                  placeholder={'Select'}
                  error={errors?.state}
                  onChange={(option) => setFieldValue('state', option?.value)}
                  value={stateOption?.find((option) => option?.value === values?.state)}
                />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Zip code (Optional)</FormLabel>
                <InputType placeholder={'Type Here'} name={'zip_code'} onBlur={handleBlur} />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Rep name</FormLabel>
                <InputType placeholder={'Type Here'} name={'representative_name'} onBlur={handleBlur} />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Email</FormLabel>
                <InputType placeholder={'Type Here'} type={'email'} name={'email'} onBlur={handleBlur} />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Cell phone</FormLabel>
                <div className='flex items-start'>
                  <div className='bg-light-grey px-4 py-[11px] border border-r-0 border-medium-grey rounded-ss-lg rounded-es-lg'>
                    <select
                      name='cell_phn_contry_code'
                      value={values?.cell_phn_contry_code}
                      onChange={(event) => {
                        setFieldValue('cell_phn_contry_code', Number(event.target.value))
                      }}
                      className='font-sm leading-[21px] font-semibold bg-transparent'
                    >
                      {countryCodeOption.map((country) => (
                        <option key={country?.value + 'cell_phn_contry_code'} value={country?.value}>
                          {country?.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <InputType
                    type={'number'}
                    name={'cell_phone_number'}
                    placeholder={'Type here'}
                    className={'rounded-ss-none rounded-es-none'}
                    showError={false}
                    fullWidth
                  />
                </div>
                <div className='text-site-red text-sm font-medium'>{errors?.cell_phone_number}</div>
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Delivery days </FormLabel>
                {/* <SelectType
                  fullWidth={'!w-full'}
                  options={dayOptions}
                  placeholder={'Select'}
                  error={errors?.delivery_day}
                  onChange={(option) => setFieldValue('delivery_day', option?.value)}
                  value={dayOptions?.find((option) => option?.value === values?.delivery_day)}
                /> */}
                <SelectType
                  fullWidth={'!w-full'}
                  options={dayOptions}
                  placeholder={'Select'}
                  error={errors?.delivery_day}
                  isMulti={true} // Enable multi-select mode
                  onChange={(selectedOptions) =>
                    setFieldValue(
                      'delivery_day',
                      selectedOptions.map((option) => option.value),
                    )
                  }
                  value={dayOptions?.filter((option) => values?.delivery_day?.includes(option.value))}
                />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>Avg. delivery date </FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={avgDeliveryDaysOptions}
                  placeholder={'Select'}
                  error={errors?.avg_delivery_date}
                  onChange={(option) => setFieldValue('avg_delivery_date', option?.value)}
                  value={avgDeliveryDaysOptions?.find((option) => option?.value === values?.avg_delivery_date)}
                />
              </div>
              <div className='md:col-span-6 col-span-12 mb-1'>
                <FormLabel>{`Minimum order in ${generalData?.currency ?? ''}`}</FormLabel>
                <InputGroup
                  prefix={<span>{generalData?.currency ?? ''}</span>}
                  placeholder='Type here'
                  name={'min_order'}
                  type={'number'}
                  error={errors?.min_order}
                />
              </div>
              <div className='col-span-12 mb-1'>
                <div className='flex items-center justify-end gap-4'>
                  <Button onClick={handleCloseModal} secondary className={'w-full md:w-auto'}>
                    Cancel
                  </Button>
                  <Button primary type='submit' disabled={isSubmitting} className={'w-full md:w-auto'}>
                    {selectedItem?.id ? 'Edit' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default AddSupplier
