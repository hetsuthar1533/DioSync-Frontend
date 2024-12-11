import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import FormLabel from '../../../components/core/typography/FormLabel'
import InputType from '../../../components/core/formComponents/InputType'
import Button from '../../../components/core/formComponents/Button'
import SelectType from '../../../components/core/formComponents/SelectType'
import { addStaffMemberValidationSchema } from '../../../validations/owner/addStaffMemberValidationSchema'
import { userSelector } from '../../../redux/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { GetVenueDropdownData } from '../../../services/barOwnerService'
import { AddNewStaffMember, UpdateStaffMember } from '../../../services/staffService'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'

function AddStaffMember({ onClose, selectedItem, getAllStaffMemberData }) {
  const owner = useSelector(userSelector)
  const dispatch = useDispatch()
  const [options, setOptions] = useState([])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bar_vanue: '',
  })

  useEffect(() => {
    if (owner?.id) {
      fetchAllVenues(owner?.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner?.id])

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        first_name: selectedItem?.first_name,
        last_name: selectedItem?.last_name,
        email: selectedItem?.email,
        bar_vanue: selectedItem?.restaurant_name,
      })
    }
  }, [selectedItem])

  const fetchAllVenues = async (id) => {
    if (id) {
      const response = await GetVenueDropdownData(id)
      if (response?.data?.data) {
        const resp = response?.data?.data?.results?.map((data) => {
          return { label: data?.name, value: data?.id }
        })
        resp && setOptions(resp)
      }
    }
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    if (selectedItem?.id) {
      const response = await UpdateStaffMember(selectedItem?.id, data)
      if (response?.data?.status === 200) {
        onClose()
        getAllStaffMemberData()
      }
    } else {
      const response = await AddNewStaffMember(data)
      if (response?.status === 201) {
        onClose()
      }
    }
    dispatch(hideLoader())
  }
  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={addStaffMemberValidationSchema}
      onSubmit={OnSubmit}
    >
      {({ isSubmitting, handleBlur, values, setFieldValue, errors }) => (
        <Form>
          <div className='grid grid-cols-12 gap-4'>
            <div className='md:col-span-6 col-span-12 mb-1'>
              <FormLabel>First name</FormLabel>
              <InputType name={'first_name'} placeholder={'Type here'} />
            </div>
            <div className='md:col-span-6 col-span-12 mb-1'>
              <FormLabel>Last name</FormLabel>
              <InputType name={'last_name'} placeholder={'Type here'} />
            </div>
            <div className='col-span-12 mb-1'>
              <FormLabel>Email</FormLabel>
              <InputType type={'mail'} name={'email'} placeholder={'Type here'} />
            </div>
            <div className='col-span-12 mb-1'>
              <FormLabel>Choose restaurant</FormLabel>
              {selectedItem?.id ? (
                <>
                  <InputType name={'bar_vanue'} placeholder={'Type here'} disabled />
                </>
              ) : (
                <SelectType
                  options={options}
                  placeholder={'Select'}
                  value={options?.find((option) => option?.value === values?.bar_vanue) || ''}
                  onChange={(option) => {
                    setFieldValue('bar_vanue', option?.value)
                  }}
                  error={errors?.bar_vanue}
                  fullWidth={'!w-full'}
                />
              )}
            </div>
            <div className='col-span-12'>
              <div className='flex items-center justify-end gap-4'>
                <Button secondary onClick={onClose}>
                  Cancel
                </Button>
                <Button primary type='submit'>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddStaffMember
