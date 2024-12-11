import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import HeadingSix from '../../../../components/core/typography/HeadingSix'
import FormLabel from '../../../../components/core/typography/FormLabel'
import TextArea from '../../../../components/core/formComponents/TextArea'
import SelectType from '../../../../components/core/formComponents/SelectType'
import Button from '../../../../components/core/formComponents/Button'
import { addOwnerVenueValidationSchema } from '../../../../validations/admin/barOwnerValidationSchema'
import { GetAllSubscriptionsPlans } from '../../../../services/subscriptionPlansService'
import { AddNewVenue, UpdateVenue } from '../../../../services/barOwnerService'

const AddBarOwnerVenue = ({ selectedItem, onClose, getAllBarOwnersVenues, ownerId }) => {
  const [subscriptionPlanList, setSubscriptionPlanList] = useState([])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    subscription_plan: '',
    venue_name: '',
    address: '',
  })
  useEffect(() => {
    getSubScriptionPlanOptions()
  }, [])

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        subscription_plan: selectedItem?.subscription_plan?.id ?? 0,
        venue_name: selectedItem?.name ?? '',
        address: selectedItem?.address ?? '',
      })
    }
  }, [selectedItem])

  const getSubScriptionPlanOptions = async () => {
    try {
      const response = await GetAllSubscriptionsPlans()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((subscription) => ({
          label: `${subscription.name} (${subscription?.validity})`,
          value: subscription.id,
        }))
        setSubscriptionPlanList(formattedData)
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error)
    }
  }

  const onSubmit = async (data) => {
    if (selectedItem) {
      const paramsData = {
        name: data?.venue_name,
        subscription_plan: data?.subscription_plan,
      }
      const response = await UpdateVenue(paramsData, selectedItem?.id)
      if (response?.data?.status === 200) {
        onClose()
        getAllBarOwnersVenues()
      }
    } else {
      const response = await AddNewVenue(data, ownerId)
      if (response?.data?.status === 200) {
        onClose()
        getAllBarOwnersVenues()
      }
    }
  }
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={defaultInitialValues}
        validationSchema={addOwnerVenueValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, handleBlur, values, setFieldValue, errors }) => (
          <Form className='grid grid-cols-12 gap-6'>
            {
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
                    name='venue_name'
                    onBlur={handleBlur}
                    value={values.venue_name}
                    onChange={(e) => setFieldValue('venue_name', e.target.value)}
                    disabled={selectedItem?.id}
                  />
                </div>
                <div className='md:col-span-12 col-span-12'>
                  <FormLabel>Venue address</FormLabel>
                  <TextArea placeholder='Type here' name='address' onBlur={handleBlur} disabled={selectedItem?.id} />
                </div>
              </>
            }
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

export default AddBarOwnerVenue
