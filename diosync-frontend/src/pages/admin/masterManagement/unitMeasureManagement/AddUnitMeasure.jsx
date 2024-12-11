import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import FormLabel from '../../../../components/core/typography/FormLabel'
import InputType from '../../../../components/core/formComponents/InputType'
import Button from '../../../../components/core/formComponents/Button'
import { unitMeasureValidationSchema } from '../../../../validations/admin/unitMeasureValidationSchema'
import { AddUnitMeasureApi, UpdateUnitMeasure } from '../../../../services/unitMeasure'
import SwitchToggle from '../../../../components/core/formComponents/SwitchToggle'

function AddUnitMeasure({ selectedItem, handleCloseModal, getUnitMeasureData }) {
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    name: '',
    value_into_gm: '',
    is_active: true,
  })
  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        name: selectedItem?.name,
        value_into_gm: selectedItem?.value_into_gm,
        is_active: selectedItem?.is_active,
      })
    }
  }, [])

  const handleCallListApi = () => {
    handleCloseModal()
    getUnitMeasureData()
  }

  const OnSubmit = async (data) => {
    if (selectedItem?.id) {
      const response = await UpdateUnitMeasure(data, selectedItem?.id)
      if (response?.status === 200) {
        handleCallListApi()
      }
    } else {
      const response = await AddUnitMeasureApi(data)
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
        validationSchema={unitMeasureValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ isSubmitting, handleBlur, setFieldValue, values }) => (
          <Form className='grid grid-cols-12 gap-4'>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Unit measure</FormLabel>
              <InputType placeholder='Unit measure' type='text' name='name' onBlur={handleBlur} />
            </div>
            <div className='md:col-span-6 col-span-12'>
              <FormLabel>Value into gm</FormLabel>
              <InputType placeholder='Value into gm' type='text' name='value_into_gm' onBlur={handleBlur} />
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

export default AddUnitMeasure
