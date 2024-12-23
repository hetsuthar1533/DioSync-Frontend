import React from 'react'
import AuthLeftWrapper from '../../components/containers/AuthLeftWrapper'
import Paragraph from '../../components/core/typography/Paragraph'
import { Form, Formik } from 'formik'
import FormLabel from '../../components/core/typography/FormLabel'
import InputType from '../../components/core/formComponents/InputType'
import Button from '../../components/core/formComponents/Button'
import Logo from '../../assets/images/logo.svg'
import { ForgotPassword } from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/path'
import { forgetPasswordValidationSchema } from '../../validations/authentication/forgetPasswordValidationSchema'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { HiOutlineArrowLeft } from 'react-icons/hi2'
import { setEmail } from '../../redux/slices/userSlice'
// import { emailSelector } from '../../redux/slices/userSlice'
function ForgetPassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    console.log("thai jaje have")
    dispatch(setEmail(data.email));
    
    console.log("hii am only email:",data.email) // Set email in Redux store
    const response = await ForgotPassword({
      email: data.email,
    })
    console.log("live ")

    const { success, status } = response.data
    console.log(response?.data)
    if (success && status === 200) {
      navigate(`${paths.auth.otp}`)
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
              <div className={`flex items-center gap-2`}>
                <button
                  className={`rounded-full flex items-center justify-center relative`}
                  onClick={() => navigate(paths?.auth?.login)}
                >
                  <HiOutlineArrowLeft size={18} />
                </button>
                <Paragraph text24 className={'mb-2'}>
                  Forgot password
                </Paragraph>
              </div>
              <Paragraph text12 className={'md:mb-10 mb-5'}>
                Enter your email address to recover your password
              </Paragraph>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={forgetPasswordValidationSchema}
                onSubmit={OnSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className='xxl:w-3/4 xl:w-4/5 w-full'>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-12 mb-6'>
                        <FormLabel>Email address</FormLabel>
                        <InputType placeholder='Type here' type='text' name='email' />
                      </div>
                      <div className='col-span-12'>
                        <Button primary className={'w-full lg:!py-3'} type='submit' disabled={isSubmitting}>
                          Send code
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
