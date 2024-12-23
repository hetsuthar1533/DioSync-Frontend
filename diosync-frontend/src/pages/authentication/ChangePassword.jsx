import React, { useEffect } from 'react'
import AuthLeftWrapper from '../../components/containers/AuthLeftWrapper'
import Paragraph from '../../components/core/typography/Paragraph'
import { Formik } from 'formik'
import InputType from '../../components/core/formComponents/InputType'
import FormLabel from '../../components/core/typography/FormLabel'
import Button from '../../components/core/formComponents/Button'
import Logo from '../../assets/images/logo.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChangePasswordValidationSchema } from '../../validations/authentication/ChangePasswordValidationSchema'
import { ChangePasswordFistTime } from '../../services/authService'
import { paths } from '../../routes/path'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'

function ChangePassword() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // useEffect(() => {
  //   if (!state?.secret) {
  //     navigate(paths?.auth?.login)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state?.secret])

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    const sentData = {
      secret: state.secret,
      new_password: data?.newPassword,
      confirm_new_password: data?.confirmPassword,
    }
    const response = await ChangePasswordFistTime(sentData)
    console.log(response)
    const { success, status } = response?.data
    if (success && status === 200) {
      navigate(paths?.auth?.login)
    }
    dispatch(hideLoader())
  }

  return (
    <div className='bg-site-black lg:p-6 sm:p-4 p-3 min-h-screen'>
      <div className='bg-white rounded-2xl md:rounded-3xl p-3 sm:p-4 lg:p-8 lg:min-h-[calc(100vh-48px)] sm:min-h-[calc(100vh-32px)] min-h-[calc(100vh-24px)]'>
        <div className='grid grid-cols-12 h-full lg:gap-6 gap-3'>
          <div className='col-span-6 h-full md:block hidden'>
            <AuthLeftWrapper />
          </div>
          <div className='md:col-span-6 sm:col-span-8 col-span-12 md:col-start-7 sm:col-start-3'>
            <div className='flex items-start justify-center flex-col md:min-h-full min-h-[calc(100vh-64px)] xl:ps-[88px] ps-0'>
              <div className='mb-8 md:hidden block'>
                <img src={Logo} alt='logo' width='32px' height='32px' />
              </div>
              <Paragraph text24 className={'mb-2'}>
                Change password
              </Paragraph>
              <Paragraph text12 className={'md:mb-10 mb-5'}>
                Please enter your current password to change your password
              </Paragraph>
              <Formik
                initialValues={{
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={ChangePasswordValidationSchema}
                onSubmit={OnSubmit}
              >
                {({ errors, touched, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit} className='xxl:w-3/4 xl:w-4/5 w-full'>
                    <div className='grid grid-cols-12 gap-4'>
                      {/* <div className='col-span-12'>
                        <FormLabel>Current Password</FormLabel>
                        <InputType placeholder='Enter password' type='password' name='password' />
                        {errors.password && touched.password && errors.password}
                        <Paragraph text12 className={'text-dark-grey mt-[6px]'}>
                          Must be at least 8 characters
                        </Paragraph>
                      </div> */}
                      <div className='col-span-12'>
                        <FormLabel>New password</FormLabel>
                        <InputType placeholder='Type here' type='password' name='newPassword' />
                        {errors.password && touched.password && errors.password}
                        <Paragraph text12 className={'text-dark-grey mt-[6px]'}>
                          Must be at least 8 characters
                        </Paragraph>
                      </div>
                      <div className='col-span-12 mb-6'>
                        <FormLabel>Confirm password</FormLabel>
                        <InputType placeholder='Type here' type='password' name='confirmPassword' />
                        {errors.password && touched.password && errors.password}
                        <Paragraph text12 className={'text-dark-grey mt-[6px]'}>
                          Must be at least 8 characters
                        </Paragraph>
                      </div>
                      <div className='col-span-12'>
                        <Button primary className={'w-full lg:!py-3'} type='submit' disabled={isSubmitting}>
                          Change password
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
