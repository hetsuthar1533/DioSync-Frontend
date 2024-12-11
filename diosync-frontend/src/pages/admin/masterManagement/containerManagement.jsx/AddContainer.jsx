import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import FormLabel from '../../../../components/core/typography/FormLabel'
import InputType from '../../../../components/core/formComponents/InputType'
import Button from '../../../../components/core/formComponents/Button'
import { containerValidationSchema } from '../../../../validations/admin/containerValidationSchema'
import { AddContainerApi, UpdateContainer } from '../../../../services/containerService'
import SwitchToggle from '../../../../components/core/formComponents/SwitchToggle'

function AddContainer({ selectedItem, getContainerData, handleCloseModal }) {
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    name: '',
    is_active: true,
  })
  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({ name: selectedItem?.name, is_active: selectedItem?.is_active })
    }
  }, [])

  const handleCallListApi = () => {
    handleCloseModal()
    getContainerData()
  }

  const OnSubmit = async (data) => {
    if (selectedItem?.id) {
      const response = await UpdateContainer(data, selectedItem?.id)
      if (response?.status === 200) {
        handleCallListApi()
      }
    } else {
      const response = await AddContainerApi(data)
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
        validationSchema={containerValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ isSubmitting, handleBlur, setFieldValue, values }) => (
          <Form className='grid grid-cols-12 gap-4'>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Container name</FormLabel>
              <InputType placeholder='Container name' type='text' name='name' onBlur={handleBlur} />
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

export default AddContainer
