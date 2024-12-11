import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import FormLabel from '../../../../components/core/typography/FormLabel'
import InputType from '../../../../components/core/formComponents/InputType'
import Button from '../../../../components/core/formComponents/Button'
import { categoryValidationSchema } from '../../../../validations/admin/categoryValidationSchema'
import { AddCategories, UpdateCategories } from '../../../../services/categoryService'
import SwitchToggle from '../../../../components/core/formComponents/SwitchToggle'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../../redux/slices/siteLoaderSlice'

function AddCategory({ selectedItem, handleCloseModal, getCategoriesData }) {
  const dispatch = useDispatch()
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    name: '',
    is_active: true,
  })

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({ name: selectedItem.name, is_active: selectedItem.is_active })
    }
  }, [selectedItem])

  const handleCallListApi = () => {
    handleCloseModal()
    getCategoriesData()
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    if (selectedItem?.id) {
      const response = await UpdateCategories(data, selectedItem?.id)
      if (response?.status === 200) {
        handleCallListApi()
      }
    } else {
      const response = await AddCategories(data)
      if (response?.status === 201) {
        handleCallListApi()
      }
    }
    dispatch(hideLoader())
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={categoryValidationSchema}
      onSubmit={OnSubmit}
    >
      {({ isSubmitting, handleBlur, values, setFieldValue }) => (
        <Form className='grid grid-cols-12 gap-4'>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Category name</FormLabel>
            <InputType placeholder='Category name' type='text' name='name' onBlur={handleBlur} />
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

export default AddCategory
