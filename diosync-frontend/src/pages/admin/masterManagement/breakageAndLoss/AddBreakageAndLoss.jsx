import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import FormLabel from '../../../../components/core/typography/FormLabel'
import Button from '../../../../components/core/formComponents/Button'
import TextArea from '../../../../components/core/formComponents/TextArea'
import { breakageAndLossValidationSchema } from '../../../../validations/admin/breakageAndLossValidationSchema'
import { AddBreakageAndLossApi, UpdateBreakageAndLoss } from '../../../../services/breakageAndLossService'
import SwitchToggle from '../../../../components/core/formComponents/SwitchToggle'

function AddBreakageLoss({ selectedItem, getBreakageAndLossData, handleCloseModal }) {
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    reason: '',
    is_active: true,
  })
  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({ reason: selectedItem?.reason, is_active: selectedItem?.is_active })
    }
  }, [])

  const handleCallListApi = () => {
    handleCloseModal()
    getBreakageAndLossData()
  }

  const OnSubmit = async (data) => {
    if (selectedItem?.id) {
      const response = await UpdateBreakageAndLoss(data, selectedItem?.id)
      if (response?.status === 200) {
        handleCallListApi()
      }
    } else {
      const response = await AddBreakageAndLossApi(data)
      if (response?.status === 201) {
        handleCallListApi()
      }
    }
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={defaultInitialValues}
        validationSchema={breakageAndLossValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ isSubmitting, handleBlur, setFieldValue, values }) => (
          <Form className='grid grid-cols-12 gap-4'>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Add reason</FormLabel>
              <TextArea placeholder='Add reason' onBlur={handleBlur} name='reason' />
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
    </>
  )
}

export default AddBreakageLoss
