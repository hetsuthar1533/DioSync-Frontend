import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import Paragraph from '../../../components/core/typography/Paragraph'
import { resetPasswordValidationSchema } from '../../../validations/admin/resetPasswordValidationSchema'
import FormLabel from '../../../components/core/typography/FormLabel'
import InputType from '../../../components/core/formComponents/InputType'
import Button from '../../../components/core/formComponents/Button'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../../routes/path'
import WhiteCard from '../../../components/themeComponents/WhiteCard'
import { ResetPasswordApi } from '../../../services/authService'
import { useSelector } from 'react-redux'
import { userSelector } from '../../../redux/slices/userSlice'
import { userRoles } from '../../../constants/roleConstants'

function ResetPassword() {
  const { user_type } = useSelector(userSelector)
  let navigate = useNavigate()

  const [defaultInitialValues] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  const handleClose = () => {
    if (user_type === userRoles?.SuperAdmin) {
      navigate(paths.admin.dashboard)
    } else if (user_type === userRoles?.Owner) {
      navigate(paths.owner.dashboard)
    } else {
      navigate(paths.manager.dashboard)
    }
  }

  const OnSubmit = async (data) => {
    const response = await ResetPasswordApi(data)
    if (response?.status === 200) {
      handleClose()
    }
  }

  return (
    <WhiteCard>
      <Paragraph text16 className={'font-bold mb-2'}>
        Change Password
      </Paragraph>
      <Paragraph text12 className={'md:mb-10 mb-5'}>
        Please enter your current password to change your password
      </Paragraph>
      <Formik
        enableReinitialize
        initialValues={defaultInitialValues}
        validationSchema={resetPasswordValidationSchema}
        onSubmit={OnSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Form>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12'>
                <FormLabel>Current password</FormLabel>
                <InputType placeholder='Type here' type='password' name='old_password' />
                <Paragraph text12 className={'text-dark-grey mt-[6px]'}>
                  Must be at least 8 characters
                </Paragraph>
              </div>
              <div className='col-span-12'>
                <FormLabel>New password</FormLabel>
                <InputType placeholder='Type here' type='password' name='new_password' />
                <Paragraph text12 className={'text-dark-grey mt-[6px]'}>
                  Must be at least 8 characters
                </Paragraph>
              </div>
              <div className='col-span-12 mb-6'>
                <FormLabel>Confirm password</FormLabel>
                <InputType placeholder='Type here' type='password' name='confirm_password' />
                <Paragraph text12 className={'text-dark-grey mt-[6px]'}>
                  Must be at least 8 characters
                </Paragraph>
              </div>

              <div className='col-span-12'>
                <div className='flex items-center justify-end gap-4'>
                  <Button onClick={handleClose} secondary className={'w-full md:w-auto'}>
                    Cancel
                  </Button>
                  <Button type='submit' primary disabled={isSubmitting} className={'w-full md:w-auto'}>
                    Change password
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </WhiteCard>
  )
}

export default ResetPassword
