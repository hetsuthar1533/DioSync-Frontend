import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import FormLabel from '../../../components/core/typography/FormLabel'
import InputType from '../../../components/core/formComponents/InputType'
import Button from '../../../components/core/formComponents/Button'
import { accountValidationSchema } from '../../../validations/admin/accountValidationSchema'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../../routes/path'
import { GetProfile, GetUser, UpdateUserProfile } from '../../../services/authService'
import { setUser } from '../../../redux/slices/userSlice'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'

function AdminProfile() {
  const dispatch = useDispatch()
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    first_name: '',
    last_name: '',
    // username: '',
    email: '',
  })
  const fetchProfile = async () => {
    dispatch(showLoader())
    const response = await GetProfile()
    if (response?.data?.data && response?.data?.status === 200) {
      setDefaultInitialValues({ ...response?.data?.data })
    }
    dispatch(hideLoader())
  }

  useEffect(() => {
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let navigate = useNavigate()

  const handleClose = () => {
    navigate(paths.admin.dashboard)
  }
  const OnSubmit = async (data) => {
    dispatch(showLoader())
    const params = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      // username: data?.username,
    }
    const response = await UpdateUserProfile(params)
    if (response?.status === 200) {
      const userData = await GetUser()
      const { status } = userData
      if (status === 200) {
        dispatch(setUser(userData?.data?.data))
      }
    }
    dispatch(hideLoader())
    handleClose()
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={accountValidationSchema}
      onSubmit={OnSubmit}
    >
      {({ isSubmitting, handleBlur }) => (
        <Form className='grid grid-cols-12 gap-4'>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>First name</FormLabel>
            <InputType placeholder='Type here' type='text' name='first_name' onBlur={handleBlur} />
          </div>
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Last name</FormLabel>
            <InputType placeholder='Type here' type='text' name='last_name' onBlur={handleBlur} />
          </div>
          {/* <div className='md:col-span-6 col-span-12'>
            <FormLabel>User name</FormLabel>
            <InputType placeholder='Type here' type='text' name='username' onBlur={handleBlur} />
          </div> */}
          <div className='md:col-span-6 col-span-12'>
            <FormLabel>Email</FormLabel>
            <InputType placeholder='Type here' type='text' name='email' onBlur={handleBlur} disabled />
          </div>
          <div className='col-span-12'>
            <div className='flex items-center justify-end gap-4'>
              <Button type='button' onClick={handleClose} secondary className={'w-full md:w-auto'}>
                Cancel
              </Button>
              <Button type='submit' primary disabled={isSubmitting} className={'w-full md:w-auto'}>
                Save
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AdminProfile
