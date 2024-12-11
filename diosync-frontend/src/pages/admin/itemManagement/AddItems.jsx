import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import FormLabel from '../../../components/core/typography/FormLabel'
import InputType from '../../../components/core/formComponents/InputType'
import Button from '../../../components/core/formComponents/Button'
import SelectType from '../../../components/core/formComponents/SelectType'
import SwitchToggle from '../../../components/core/formComponents/SwitchToggle'
import { addItemValidationSchema } from '../../../validations/admin/addItemValidationSchema'
import { ItemsApiAdd, UpdateItems } from '../../../services/itemsService'
import { GetAllCategories } from '../../../services/categoryService'
import { GetAllSubCategories } from '../../../services/subCategoryService'
import { GetAllCaseSize } from '../../../services/caseSizeService'
import UploadFile from '../../../components/core/formComponents/FileInput'
import { EnumFileType } from '../../../constants/commonConstants'
import FileInput from '../../../components/core/formComponents/FileInput'

function AddItems({ selectedItem, handleCloseModal, getItemsData }) {
  const [categoriesList, setCategoriesList] = useState([])
  const [subCategoriesList, setSubCategoriesList] = useState([])
  const [caseSizeList, setCaseSizeList] = useState([])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    image: null,
    name: '',
    brand_name: '',
    category: '',
    sub_category: '',
    barcode: '',
    unit_size: '',
    case_size: '',
    is_active: true,
  })

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        image: selectedItem?.image,
        name: selectedItem?.name,
        brand_name: selectedItem?.brand_name,
        category: selectedItem?.category?.id,
        sub_category: selectedItem?.sub_category?.id,
        barcode: selectedItem?.barcode,
        unit_size: selectedItem?.unit_size,
        case_size: selectedItem?.case_size?.id,
        is_active: selectedItem?.is_active,
      })
    }
  }, [selectedItem])

  useEffect(() => {
    fetchCategories()
    fetchAllSubCategories()
    fetchAllCaseSize()
  }, [])
  const fetchAllCaseSize = async () => {
    try {
      const response = await GetAllCaseSize()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((subcategory) => ({
          label: subcategory.name,
          value: subcategory.id,
        }))
        setCaseSizeList(formattedData)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

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
  const fetchAllSubCategories = async () => {
    try {
      const response = await GetAllSubCategories()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((subcategory) => ({
          label: subcategory.sub_category_name,
          value: subcategory.id,
        }))
        setSubCategoriesList(formattedData)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }
  const handleCallListApi = () => {
    handleCloseModal()
    getItemsData()
  }

  const OnSubmit = async (data) => {
    if (selectedItem?.id) {
      const bodyData = new FormData()
      data?.image?.typeof === 'object' && bodyData.append('image', data?.image)
      bodyData.append('name', data?.name)
      bodyData.append('brand_name', data?.brand_name)
      bodyData.append('category', data?.category)
      bodyData.append('sub_category', data?.sub_category)
      bodyData.append('barcode', data?.barcode)
      bodyData.append('unit_size', data?.unit_size)
      bodyData.append('case_size', data?.case_size)
      bodyData.append('is_active', data?.is_active)
      const response = await UpdateItems(bodyData, selectedItem?.id)
      if (response?.data?.status === 200) {
        handleCallListApi()
      }
    } else {
      const bodyData = new FormData()
      bodyData.append('image', data?.image)
      bodyData.append('name', data?.name)
      bodyData.append('brand_name', data?.brand_name)
      bodyData.append('category', data?.category)
      bodyData.append('sub_category', data?.sub_category)
      bodyData.append('barcode', data?.barcode)
      bodyData.append('unit_size', data?.unit_size)
      bodyData.append('case_size', data?.case_size)
      bodyData.append('is_active', data?.is_active)
      const response = await ItemsApiAdd(bodyData)
      if (response?.status === 200) {
        handleCallListApi()
      }
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={addItemValidationSchema}
      onSubmit={OnSubmit}
    >
      {({ isSubmitting, handleBlur, setFieldValue, values, errors }) => (
        <Form className='grid grid-cols-12 gap-4'>
          <div className='md:col-span-12 col-span-12'>
            <FormLabel>Item image</FormLabel>
            <FileInput
              parentClass=' col-span-2'
              setValue={setFieldValue}
              name='image'
              value={values?.image ? values?.image : null}
              isImage={true}
              acceptTypes='image/*'
              isMulti={false}
            />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Item name</FormLabel>
            <InputType placeholder='Item name' type='text' name='name' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Brand name</FormLabel>
            <InputType placeholder='Brand name' type='text' name='brand_name' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Category name</FormLabel>
            <SelectType
              fullWidth={'!w-full'}
              options={categoriesList}
              placeholder='Select'
              error={errors?.category}
              onChange={(option) => setFieldValue('category', option?.value)}
              value={categoriesList?.find((option) => option?.value === values?.category)}
            />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Subcategory name</FormLabel>
            <SelectType
              fullWidth={'!w-full'}
              options={subCategoriesList}
              placeholder='Select'
              error={errors?.sub_category}
              onChange={(option) => setFieldValue('sub_category', option?.value)}
              value={subCategoriesList?.find((option) => option?.value === values?.sub_category)}
            />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Barcode (Optional)</FormLabel>
            <InputType placeholder='Barcode' type='text' name='barcode' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Unit size</FormLabel>
            <InputType placeholder='Unit Size' type='text' name='unit_size' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Case size(Optional)</FormLabel>

            <SelectType
              fullWidth={'!w-full'}
              options={caseSizeList}
              placeholder='Select'
              error={errors?.case_size}
              onChange={(option) => setFieldValue('case_size', option?.value)}
              value={caseSizeList?.find((option) => option?.value === values?.case_size)}
            />
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

export default AddItems
