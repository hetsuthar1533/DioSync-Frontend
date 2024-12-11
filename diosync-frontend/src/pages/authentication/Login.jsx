/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import AuthLeftWrapper from '../../components/containers/AuthLeftWrapper'
import Paragraph from '../../components/core/typography/Paragraph'
import { Form, Formik } from 'formik'
import InputType from '../../components/core/formComponents/InputType'
import Button from '../../components/core/formComponents/Button'
import FormLabel from '../../components/core/typography/FormLabel'
import Checkbox from '../../components/core/formComponents/Checkbox'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../assets/images/logo.svg'
import { loginValidationSchema } from '../../validations/authentication/loginValidationSchema'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { paths } from '../../routes/path'
import { GetUser, LoginUser } from '../../services/authService'
import { setRefreshToken, setToken, setUser, setUserType } from '../../redux/slices/userSlice'
import { userRoles } from '../../constants/roleConstants'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  useEffect(() => {
    const queryParams = new URLSearchParams(location?.search)
    if (location?.search && queryParams) {
      const access = atob(queryParams?.get('access'))
      const refresh = atob(queryParams?.get('refresh'))
      if (access && refresh) {
        const data = {
          token: {
            access,
            refresh,
          },
          user_type: userRoles?.Owner,
        }
        handleTempPwdChanged(data)
      }
    }
  }, [dispatch, location?.search])

  useEffect(() => {
    const rememberMe = localStorage?.getItem('rememberMe') === 'true' ? true : false
    const rememberedCreds = rememberMe ? localStorage?.getItem('savedCreds') : ''
    if (rememberedCreds) {
      setDefaultInitialValues({
        email: JSON.parse(rememberedCreds)?.email,
        password: JSON.parse(rememberedCreds)?.password,
        rememberMe: true,
      })
    }
  }, [])

  async function OnSubmit(paramsData) {
    dispatch(showLoader())
    const params = {
      email: paramsData?.email,
      password: paramsData?.password,
    }
    try {
      const response = await LoginUser(params)
      await handleLoginResponse(response, paramsData)
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(hideLoader())
    }
  }

  //Login Response
  async function handleLoginResponse(response, params) {
    const { success, status, data } = response?.data
    if (success && status === 200) {
      if (data?.is_temp_pwd_changed) {
        await handleTempPwdChanged(data, params)
      } else {
        navigateToNewPassword(data)
      }
    }
  }

  //handle Temp password changed
  async function handleTempPwdChanged(data, params) {
    dispatch(setToken(data?.token?.access))
    dispatch(setRefreshToken(data?.token?.refresh))
    dispatch(setUserType(data?.user_type))
    params && handleRememberMe(params)
    const userData = await GetUser()
    // const { status } = userData
    if (userData?.status === 200) {
      dispatch(setUser(userData?.data?.data))
    }
    if (data?.user_type === userRoles.SuperAdmin) {
      navigate(paths?.admin?.dashboard)
    } else if (data?.user_type === userRoles.Manager) {
      navigate(paths.manager.dashboard)
    } else if (data?.user_type === userRoles.Owner) {
      navigate(paths?.owner?.dashboard)
    }
  }

  function handleRememberMe(params) {
    if (params?.rememberMe) {
      localStorage.setItem('savedCreds', JSON.stringify(params))
      localStorage.setItem('rememberMe', params?.rememberMe)
    } else {
      localStorage.removeItem('savedCreds')
      localStorage.removeItem('rememberMe')
    }
  }

  function navigateToNewPassword(data) {
    navigate(paths.auth.changePassword, { state: { secret: data?.secret } })
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
                Log in to your Account
              </Paragraph>
              <Paragraph text12 className={'md:mb-10 mb-5'}>
                Welcome back!
              </Paragraph>
              <Formik
                initialValues={defaultInitialValues}
                validationSchema={loginValidationSchema}
                onSubmit={OnSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values, handleChange }) => (
                  <Form className='xxl:w-3/4 xl:w-4/5 w-full'>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-12'>
                        <FormLabel>Email address</FormLabel>
                        <InputType placeholder='Type here' type='text' name='email' />
                      </div>
                      <div className='col-span-12'>
                        <FormLabel>Password</FormLabel>
                        <InputType placeholder='Type here' type='password' name='password' />
                      </div>
                      <div className='col-span-12'>
                        <div className='flex items-center justify-between gap-3 mb-6'>
                          <Checkbox
                            w18
                            name={'rememberMe'}
                            id={'rememberMe'}
                            onChange={handleChange}
                            checked={values.rememberMe}
                          >
                            Remember me
                          </Checkbox>
                          <Link
                            to={paths.auth.forgotPassword}
                            className='md:text-base md:leading-6 text-sm leading-5 font-semibold text-primary-blue hover:text-site-black transition-all duration-300'
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                      <div className='col-span-12'>
                        <Button primary className={'w-full lg:!py-3'} type='submit' disabled={isSubmitting}>
                          Login
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

export default Login
