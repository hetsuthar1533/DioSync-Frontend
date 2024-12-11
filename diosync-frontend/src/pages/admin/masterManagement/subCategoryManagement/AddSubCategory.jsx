import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import FormLabel from '../../../../components/core/typography/FormLabel'
import InputType from '../../../../components/core/formComponents/InputType'
import Button from '../../../../components/core/formComponents/Button'
import { subCategoryValidationSchema } from '../../../../validations/admin/subCategoryValidationSchema'
import SelectType from '../../../../components/core/formComponents/SelectType'
import { AddSubCategories, UpdateSubCategories } from '../../../../services/subCategoryService'
import { GetAllCategories } from '../../../../services/categoryService'
import SwitchToggle from '../../../../components/core/formComponents/SwitchToggle'

function AddSubCategory({ selectedItem, handleCloseModal, getSubCategoriesData }) {
  const [categoriesList, setCategoriesList] = useState([])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    category: '',
    sub_category_name: '',
    is_active: true,
  })

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        category: selectedItem.category?.id,
        sub_category_name: selectedItem.sub_category_name,
        is_active: selectedItem.is_active,
      })
    }
  }, [selectedItem])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetAllCategories()
        if (response?.data?.status === 200) {
          const formattedData = response?.data?.data.map((category) => ({
            label: category.name,
            value: category.id,
          }))
          setCategoriesList(formattedData)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const OnSubmit = async (data) => {
    if (selectedItem?.id) {
      const response = await UpdateSubCategories(data, selectedItem?.id)
      if (response?.data?.status === 200) {
        handleCloseModal()
        getSubCategoriesData()
      }
    } else {
      let payload = {
        sub_category_name: data?.sub_category_name,
        category: parseInt(data?.category),
        is_active: data?.is_active,
      }
      const response = await AddSubCategories(payload)
      if (response?.status === 200) {
        getSubCategoriesData()
        handleCloseModal()
      }
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={subCategoryValidationSchema}
      onSubmit={OnSubmit}
    >
      {({ isSubmitting, handleBlur, setFieldValue, values, errors }) => (
        <Form className='grid grid-cols-12 gap-4'>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Category</FormLabel>
            <SelectType
              fullWidth={'sm:!w-auto !w-full'}
              options={categoriesList}
              placeholder={'Select'}
              error={errors?.category}
              onChange={(option) => setFieldValue('category', option?.value)}
              value={categoriesList?.find((option) => option?.value === values?.category) || ''}
            />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Subcategory name</FormLabel>
            <InputType placeholder='Type here' type='text' name='sub_category_name' onBlur={handleBlur} />
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

export default AddSubCategory
