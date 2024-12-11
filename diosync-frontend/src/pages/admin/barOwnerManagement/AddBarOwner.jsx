import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import FormLabel from '../../../components/core/typography/FormLabel'
import InputType from '../../../components/core/formComponents/InputType'
import Button from '../../../components/core/formComponents/Button'
import TextArea from '../../../components/core/formComponents/TextArea'
import {
  addOwnerValidationSchema,
  editOwnerValidationSchema,
} from '../../../validations/admin/barOwnerValidationSchema'
import SelectType from '../../../components/core/formComponents/SelectType'
import HeadingSix from '../../../components/core/typography/HeadingSix'
import { GetAllSubscriptionsPlans } from '../../../services/subscriptionPlansService'
import { CreateBarOwner } from '../../../services/barOwnerService'
import { GetAllCountriesCode } from '../../../services/commonService'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'

function AddBarOwner({ selectedItem, onClose, getBarOwners }) {
  const dispatch = useDispatch()
  const [countryCodeOption, setCountryCodeOption] = useState([])
  const [subscriptionPlanList, setSubscriptionPlanList] = useState([])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_contry_code: '',
    phone_number: '',
    // costAlert: '',
    subscription_plan: '',
    name: '',
    address: '',
  })
  useEffect(() => {
    fetchCountryCodes()
    getSubScriptionPlanOptions()
  }, [])

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({ ...selectedItem })
    }
  }, [selectedItem])

  const handleCallListApi = () => {
    onClose()
    getBarOwners()
  }

  const onSubmit = async (data) => {
    dispatch(showLoader())
    if (selectedItem?.id) {
      // const response = await data
      // if (response?.data?.status === 200) {
      //   handleCallListApi()
      // }
    } else {
      const response = await CreateBarOwner(data)
      if (response?.data?.status === 200) {
        handleCallListApi()
      }
    }
    dispatch(hideLoader())
  }

  const getSubScriptionPlanOptions = async () => {
    try {
      const response = await GetAllSubscriptionsPlans()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((category) => ({
          label: `${category.name} (${category?.validity})`,
          value: category.id,
        }))
        setSubscriptionPlanList(formattedData)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
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
    if (!selectedItem && countryCodeOption.length > 0) {
      setDefaultInitialValues((prev) => ({
        ...prev,
        phone_contry_code: countryCodeOption[0].value,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCodeOption])

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={selectedItem?.id ? editOwnerValidationSchema : addOwnerValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, handleBlur, values, setFieldValue, errors }) => (
        <Form className='grid grid-cols-12 gap-6'>
          <div className='col-span-12'>
            <HeadingSix>Basic details</HeadingSix>
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>First name</FormLabel>
            <InputType placeholder='Type here' type='text' name='first_name' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Last name</FormLabel>
            <InputType placeholder='Type here' type='text' name='last_name' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Email</FormLabel>
            <InputType placeholder='Type here' type='email' name='email' onBlur={handleBlur} />
          </div>

          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Phone number</FormLabel>
            <div className='flex items-stretch w-full'>
              <div className='bg-light-grey px-4 py-[11px] border  border-medium-grey rounded-ss-lg rounded-es-lg'>
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
                onBlur={handleBlur}
                showError={false}
              />
            </div>
            <div className='text-site-red text-sm font-medium'>{errors?.phone_number}</div>
            {/* <div className='md:col-span-6 col-span-12'>
            <FormLabel>Phone number</FormLabel>
            <InputType placeholder='Type here' type='number' name='phone_number' onBlur={handleBlur} />
          </div> */}
            {/* <FormLabel>Cost Alert</FormLabel>
            <InputType placeholder='Type here' type='text' name='costAlert' onBlur={handleBlur} />
            */}
          </div>
          {!selectedItem?.id && (
            <>
              <div className='col-span-12'>
                <HeadingSix>Venue details</HeadingSix>
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Subscription plan</FormLabel>
                <SelectType
                  fullWidth={'sm:!w-auto !w-full'}
                  options={subscriptionPlanList}
                  placeholder={'Select'}
                  error={errors?.subscription_plan}
                  onChange={(option) => setFieldValue('subscription_plan', option?.value)}
                  value={subscriptionPlanList?.find((option) => option?.value === values?.subscription_plan) || ''}
                />
              </div>
              <div className='md:col-span-6 col-span-12'>
                <FormLabel>Venue name</FormLabel>
                <TextArea
                  placeholder='Type here'
                  rows={1}
                  name='name'
                  onBlur={handleBlur}
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                />
              </div>
              <div className='md:col-span-12 col-span-12'>
                <FormLabel>Venue address</FormLabel>
                <TextArea placeholder='Type here' name='address' onBlur={handleBlur} />
              </div>
            </>
          )}
          <div className='col-span-12 text-end'>
            <Button primary type='submit' disabled={isSubmitting}>
              {selectedItem?.id ? 'Edit' : 'Save'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddBarOwner
