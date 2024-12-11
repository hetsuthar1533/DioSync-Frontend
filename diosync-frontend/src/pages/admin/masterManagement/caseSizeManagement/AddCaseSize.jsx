import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import FormLabel from '../../../../components/core/typography/FormLabel'
import InputType from '../../../../components/core/formComponents/InputType'
import Button from '../../../../components/core/formComponents/Button'
import { caseSizeValidationSchema } from '../../../../validations/admin/caseSizeValidationSchema'
import { AddCaseSizeApi, UpdateCaseSize } from '../../../../services/caseSizeService'
import SwitchToggle from '../../../../components/core/formComponents/SwitchToggle'

function AddCaseSize({ selectedItem, getCaseSizeData, handleCloseModal }) {
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    name: '',
    size: '',
    is_active: true,
  })
  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        size: selectedItem?.size,
        name: selectedItem?.name,
        is_active: selectedItem?.is_active,
      })
    }
  }, [])

  const handleCallListApi = () => {
    handleCloseModal()
    getCaseSizeData()
  }

  const OnSubmit = async (data) => {
    if (selectedItem?.id) {
      const response = await UpdateCaseSize(data, selectedItem?.id)
      if (response?.status === 200) {
        handleCallListApi()
      }
    } else {
      const response = await AddCaseSizeApi(data)
      if (response?.status === 201) {
        handleCallListApi()
      }
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={caseSizeValidationSchema}
      onSubmit={OnSubmit}
    >
      {({ isSubmitting, handleBlur, setFieldValue, values }) => (
        <Form className='grid grid-cols-12 gap-4'>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Name</FormLabel>
            <InputType placeholder='Name' type='text' name='name' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6  col-span-12'>
            <FormLabel>Case size</FormLabel>
            <InputType placeholder='Case size' type='number' name='size' onBlur={handleBlur} />
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
  )
}

export default AddCaseSize
