import {  Formik } from 'formik'
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

import { useDispatch, useSelector } from 'react-redux'

function AddItems({ selectedItem, handleCloseModal, getItemsData,actions }) {

  const [defaultInitialValues, setDefaultInitialValues] = useState({
  

    ItemName: '',
    BrandName: '',
    Category: '',
    Subcategory: '',
    unitSize: '',
    
    status: true,
  })

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        ItemName: selectedItem?.ItemName,
        BrandName: selectedItem?.BrandName,
        Category: selectedItem?.Category,
        Subcategory: selectedItem?.Subcategory,
        unitSize: selectedItem?.unitSize,
        status: selectedItem?.status,
      })
    }
  }, [selectedItem])

 

  const handlesubmit = async (data) => {
    
    console.log(data,"from onsubmit");
    
    if (selectedItem?.itemId) {
      console.log("hi i am onsubmit",data)
      const bodyData = new FormData()
      bodyData.append('ItemName', data?.ItemName)
      bodyData.append('BrandName', data?.BrandName)
      bodyData.append('Category', data?.Category)
      bodyData.append('Subcategory', data?.Subcategory)
      bodyData.append('barcode', data?.barcode)
      bodyData.append('unitSize', data?.unitSize)
      bodyData.append('case_size', data?.case_size)
      bodyData.append('status', data?.status)
      console.log("hi i am boday data",bodyData);
      
      const response = await UpdateItems(bodyData, selectedItem?.itemId)
      if (response?.data?.status === 200) {
      getItemsData()
      }
    } else {
      const bodyData = new FormData()
    
      bodyData.append('ItemName', data?.ItemName)
      bodyData.append('BrandName', data?.BrandName)
      bodyData.append('category', data?.category)
      bodyData.append('Subcategory', data?.Subcategory)
      bodyData.append('barcode', data?.barcode)
      bodyData.append('unitSize', data?.unitSize)
      bodyData.append('case_size', data?.case_size)
      bodyData.append('status', data?.status)
      console.log(bodyData)
      const response = await ItemsApiAdd(bodyData)
      if (response?.status === 200) {
        getItemsData()
      }
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={addItemValidationSchema}
      onSubmit={handlesubmit}
   
    >
      {({  handleBlur, setFieldValue, values, errors }) => (
        <form className='grid grid-cols-12 gap-4'  >
          <div className='md:col-span-12 col-span-12'>
           
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Item name</FormLabel>
            <InputType placeholder='Item name' type='text' name='ItemName'  onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Brand name</FormLabel>
            <InputType placeholder='Brand name' type='text' name='BrandName' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Category name</FormLabel>
            <InputType placeholder='Category ' type='text' name='Category' onBlur={handleBlur} />

          </div>
         
          <div className='md:col-span-6 col-span-12'>
          <FormLabel>Subcategory name</FormLabel>
          <InputType placeholder='Subcategory' type='text' name='Subcategory' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Unit size</FormLabel>
            <InputType placeholder='Unit Size' type='text' name='unitSize' onBlur={handleBlur} />
          </div>
   
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Activate/deactivate</FormLabel>
            <SwitchToggle onChange={(value) => setFieldValue('status', value)} isChecked={values?.status} />
          </div>
          <div className='col-span-12 text-end'>
            <Button primary type='submit' >
              {selectedItem?.itemId ? 'Edit' : 'Save'}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
}

export default AddItems
