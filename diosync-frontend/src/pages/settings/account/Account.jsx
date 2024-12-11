/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import WhiteCard from '../../../components/themeComponents/WhiteCard'
import { Form, Formik } from 'formik'
import FormLabel from '../../../components/core/typography/FormLabel'
import InputType from '../../../components/core/formComponents/InputType'
import SelectType from '../../../components/core/formComponents/SelectType'
import SwitchToggle from '../../../components/core/formComponents/SwitchToggle'
import Button from '../../../components/core/formComponents/Button'
import { useDispatch, useSelector } from 'react-redux'
import { GetBarOwnerProfile, UpdateBarOwnerProfile } from '../../../services/barOwnerService'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../../routes/path'
import { setUser, userSelector } from '../../../redux/slices/userSlice'
import { GetAllCountries, GetAllCountriesCode, GetTimezone } from '../../../services/commonService'
import { currencyOptions, dayOptions } from '../../../constants/commonConstants'
import { accountValidationSchema } from '../../../validations/owner/accountValidationSchema'
import { userRoles } from '../../../constants/roleConstants'

function Account() {
  const user = useSelector(userSelector)
  const { user_type } = useSelector(userSelector)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    document.title = `Account - DioSync`
  }, [])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    // username: '',
    phone_contry_code: '',
    phone_number: '',
    country: '',
    zip_code: '',
    // time_zone: '',
    street_address: '',
    currency: 'AED',
    accounting_report_days: '',
    shift_mode: '',
  })
  const [countriesOption, setCountriesOption] = useState([])
  const [timeZoneOption, setTimeZoneOption] = useState([])
  const [countryCodeOption, setCountryCodeOption] = useState([])

  useEffect(() => {
    fetchCountries()
    fetchCountryCodes()
    fetchAllTimeZone()
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCountries = async () => {
    try {
      const response = await GetAllCountries()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data?.map((country) => ({
          label: country.name,
          value: country.id,
        }))
        setCountriesOption(formattedData)
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

  const fetchAllTimeZone = async () => {
    try {
      const response = await GetTimezone()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data?.map((time) => ({
          label: time.name,
          value: time.id,
        }))
        setTimeZoneOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const fetchProfile = async () => {
    dispatch(showLoader())
    const response = await GetBarOwnerProfile()
    if (response?.data?.data && response?.data?.status === 200) {
      setDefaultInitialValues({
        ...response?.data?.data,
        country: Number(response?.data?.data?.country),
        // time_zone: Number(response?.data?.data?.time_zone),
        phone_contry_code: response?.data?.data?.phone_contry_code ?? countryCodeOption[0]?.value,
      })
    }
    dispatch(hideLoader())
  }

  const handleClose = () => {
    navigate(-1)
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    const params = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      email: data?.email,
      // username: data?.username,
      phone_contry_code: data?.phone_contry_code,
      phone_number: data?.phone_number,
      country: data?.country,
      zip_code: data?.zip_code,
      // time_zone: data?.time_zone,
      street_address: data?.street_address,
      currency: data?.currency,
      accounting_report_days: data?.accounting_report_days,
      shift_mode: data?.shift_mode,
    }
    const response = await UpdateBarOwnerProfile(params)
    if (response?.status === 200) {
      const userData = await GetBarOwnerProfile()
      const { status } = userData
      if (status === 200) {
        dispatch(
          setUser({
            ...userData?.data?.data, // Update other properties from userData
            user_type: user.user_type, // Retain the existing user_type
          }),
        )
      }
    }
    if (user_type === userRoles.Owner) {
      navigate(paths.owner.dashboard)
    } else if (user_type === userRoles.Manager) {
      navigate(paths.manager.dashboard)
    }
    dispatch(hideLoader())
  }
  return (
    <WhiteCard>
      <Formik
        enableReinitialize
        initialValues={defaultInitialValues}
        validationSchema={accountValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ values, errors, touched, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
          <Form>
            {console.log(errors, 'errors')}
            <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3'>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>First name</FormLabel>
                <InputType name={'first_name'} placeholder={'Type here'} />
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Last name</FormLabel>
                <InputType name={'last_name'} placeholder={'Type here'} />
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Email</FormLabel>
                <InputType type={'email'} name={'email'} placeholder={'Type here'} disabled />
              </div>
              {/* <div className='md:col-span-6 col-span-12'>
                <FormLabel>User name</FormLabel>
                <InputType placeholder='Type here' type='text' name='username' onBlur={handleBlur} />
              </div> */}
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Phone</FormLabel>
                <div className='flex items-stretch w-full'>
                  <div className='bg-light-grey px-4 py-[11px] border border-r-0 border-medium-grey rounded-ss-lg rounded-es-lg'>
                    <select
                      name='phone_contry_code'
                      value={values?.phone_contry_code}
                      onChange={(event) => {
                        setFieldValue('phone_contry_code', Number(event.target.value))
                      }}
                      className='font-sm leading-[21px] font-semibold bg-transparent'
                    >
                      {countryCodeOption.map((country) => (
                        <option key={country?.value + 'phone_contry_code'} value={country?.value}>
                          {country?.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <InputType
                    type={'number'}
                    fullWidth
                    name={'phone_number'}
                    placeholder={'Type here'}
                    className={'rounded-ss-none rounded-es-none'}
                    showError={false}
                  />
                </div>
                <div className='text-site-red text-sm font-medium'>{errors?.phone_number}</div>
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Country</FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={countriesOption}
                  placeholder={'Select'}
                  error={errors?.country}
                  onChange={(option) => setFieldValue('country', option?.value)}
                  value={countriesOption?.find((option) => option?.value === values?.country)}
                />
                {/* <SelectType options={dayOptions} onChange={handleChangeSelect} fullWidth={'!w-full'} /> */}
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>ZIP code</FormLabel>
                <InputType placeholder={'Type here'} name={'zip_code'} />
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Street address</FormLabel>
                <InputType placeholder={'Type here'} name={'street_address'} />
              </div>
              {/* <div className='md:col-span-6 col-span-12'>
                <FormLabel>Time zone</FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={timeZoneOption}
                  placeholder={'Select'}
                  error={errors?.time_zone}
                  onChange={(option) => setFieldValue('time_zone', option?.value)}
                  value={timeZoneOption?.find((option) => option?.value === values?.time_zone)}
                />
              </div> */}
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Currency</FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={currencyOptions}
                  placeholder={'Select'}
                  error={errors?.currency}
                  onChange={(option) => setFieldValue('currency', option?.value)}
                  value={currencyOptions?.find((option) => option?.value === values?.currency)}
                />
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Accounting reports days</FormLabel>
                <SelectType
                  fullWidth={'!w-full'}
                  options={dayOptions}
                  placeholder={'Select'}
                  error={errors?.accounting_report_days}
                  onChange={(option) => setFieldValue('accounting_report_days', option?.value)}
                  value={dayOptions?.find((option) => option?.value === values?.accounting_report_days)}
                />
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel className={'!mb-4'}>Shift mode</FormLabel>
                <SwitchToggle
                  leftLabel={'Day'}
                  rightLabel={'Night'}
                  onChange={(value) => setFieldValue('shift_mode', value === true ? 'Night' : 'Day')}
                  isChecked={values?.shift_mode === 'Day' ? false : true}
                />
              </div>
              <div className='col-span-12 mt-1'>
                <div className='flex items-center justify-end gap-4'>
                  {/* <Button secondary onClick={handleClose}>
                    Cancel
                  </Button> */}
                  <Button primary disabled={isSubmitting} type='submit'>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </WhiteCard>
  )
}

export default Account
