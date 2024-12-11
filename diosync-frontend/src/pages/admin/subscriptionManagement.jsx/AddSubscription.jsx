import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { AddSubscriptionPlanValidationSchema } from '../../../validations/admin/subscriptionPlanValidationSchema'
import FormLabel from '../../../components/core/typography/FormLabel'
import InputType from '../../../components/core/formComponents/InputType'
import Button from '../../../components/core/formComponents/Button'
import TextArea from '../../../components/core/formComponents/TextArea'
import { AddSubscriptionPlanApi, UpdateSubscriptionPlans } from '../../../services/subscriptionPlansService'
import SelectType from '../../../components/core/formComponents/SelectType'
import SwitchToggle from '../../../components/core/formComponents/SwitchToggle'
import { subscriptionPlanOptions } from '../../../constants/commonConstants'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'

const AddSubscription = ({ selectedItem, handleCloseModal, getSubscriptionPlanData }) => {
  const dispatch = useDispatch()
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    name: '',
    validity: '',
    price: '',
    description: '',
    is_active: true,
  })

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        name: selectedItem.name,
        validity: Number(selectedItem?.validity),
        price: selectedItem?.price,
        description: selectedItem?.description,
        is_active: selectedItem?.is_active,
      })
    }
  }, [selectedItem])

  const handleCallListApi = () => {
    handleCloseModal()
    getSubscriptionPlanData()
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    if (selectedItem?.id) {
      const response = await UpdateSubscriptionPlans(data, selectedItem?.id)
      if (response?.status === 200) {
        handleCallListApi()
      }
    } else {
      const response = await AddSubscriptionPlanApi(data)
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
        validationSchema={AddSubscriptionPlanValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ isSubmitting, handleBlur, setFieldValue, errors, values }) => (
          <Form className='grid grid-cols-12 gap-4'>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Plan name</FormLabel>
              <InputType placeholder='Type here' type='text' name='name' onBlur={handleBlur} />
            </div>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Plan validity</FormLabel>
              {/* use Dropdown here */}

              <SelectType
                fullWidth={'sm:!w-auto !w-full'}
                options={subscriptionPlanOptions}
                placeholder='Select'
                name='validity'
                onChange={(option) => setFieldValue('validity', option?.value)}
                value={subscriptionPlanOptions?.find((option) => option?.value === values?.validity)}
                error={errors.validity}
              />
            </div>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Price</FormLabel>
              <InputType placeholder='Type here' type='number' name='price' onBlur={handleBlur} />
            </div>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Plan description</FormLabel>
              <TextArea name='description' rows={1} placeholder={'Plan description'} error={errors?.description} />
            </div>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Activate/deactivate</FormLabel>
              <SwitchToggle onChange={(value) => setFieldValue('is_active', value)} isChecked={values?.is_active} />
            </div>
            <div className='col-span-12 text-end'>
              <Button primary type='submit' disabled={isSubmitting}>
                {selectedItem?.id ? 'Edit' : 'Save'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddSubscription
