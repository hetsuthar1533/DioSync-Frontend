import React, { useState, useEffect } from 'react';
import AuthLeftWrapper from '../../components/containers/AuthLeftWrapper';
import Paragraph from '../../components/core/typography/Paragraph';
import { Form, Formik, Field } from 'formik';
import InputType from '../../components/core/formComponents/InputType';
import Button from '../../components/core/formComponents/Button';
import FormLabel from '../../components/core/typography/FormLabel';
import Checkbox from '../../components/core/formComponents/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.svg';
import { signupValidationSchema } from '../../validations/authentication/signupValidationSchema';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice';
import { paths } from '../../routes/path';
import { RegisterUser } from '../../services/authService';
import { toast } from 'react-toastify';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userTypes, setUserTypes] = useState([]);
  const [defaultInitialValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: '',
    agreeToTerms: false,
  });

  useEffect(() => {
    // Fetch user types for dropdown
    const fetchUserTypes = async () => {
      try {
        const response = await axios.post('http://localhost:1234/accounts/user-types');
        setUserTypes(response.data);
      } catch (error) {
        console.error('Error fetching user types:', error);
      }
    };

    fetchUserTypes();
  }, []);

  async function OnSubmit(paramsData) {
    dispatch(showLoader());
    const params = {
      username: paramsData?.username,
      email: paramsData?.email,
      password: paramsData?.password,
      confirmPassword: paramsData?.confirmPassword,
      user_type: paramsData?.user_type,
    };
    console.log('Params:', params);
  
    try {
      const response = await RegisterUser(params);
      console.log('Response:', response);
      if (response && response.data) {
        console.log('Response Data:', response.data);
        toast.success('User registered successfully! Please log in.');
        navigate(paths.auth.login);
      } else {
        toast.error('No response data received');
        console.error('No response data received');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        if (error.response.status === 400 && error.response.data.message === 'User already exists') {
          toast.error('User already exists with this email.');
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      dispatch(hideLoader());
    }
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
                Create a New Account
              </Paragraph>
              <Paragraph text12 className={'md:mb-10 mb-5'}>
                Join us today!
              </Paragraph>
              <Formik
                initialValues={defaultInitialValues}
                validationSchema={signupValidationSchema}
                onSubmit={OnSubmit}
                validateOnChange={true}
                validateOnBlur={true}
              > 
                {({ isSubmitting, values, handleChange, errors, touched }) => (
                  <Form className='xxl:w-3/4 xl:w-4/5 w-full'>
                    {console.log('Errors:', errors)}
                    {console.log('Touched:', touched)}
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-12'>
                        <FormLabel>Username</FormLabel>
                        <Field as={InputType} placeholder='Type here' type='text' name='username' />
                        {errors.username && touched.username && (
                          <div className='text-red-500'>{errors.username}</div>
                        )}
                      </div>
                      <div className='col-span-12'>
                        <FormLabel>Email address</FormLabel>
                        <Field as={InputType} placeholder='Type here' type='text' name='email' />
                        {errors.email && touched.email && (
                          <div className='text-red-500'>{errors.email}</div>
                        )}
                      </div>
                      <div className='col-span-12'>
                        <FormLabel>Password</FormLabel>
                        <Field as={InputType} placeholder='Type here' type='password' name='password' />
                        {errors.password && touched.password && (
                          <div className='text-red-500'>{errors.password}</div>
                        )}
                      </div>
                      <div className='col-span-12'>
                        <FormLabel>Confirm Password</FormLabel>
                        <Field as={InputType} placeholder='Type here' type='password' name='confirmPassword' />
                        {errors.confirmPassword && touched.confirmPassword && (
                          <div className='text-red-500'>{errors.confirmPassword}</div>
                        )}
                      </div>
                      <div className='col-span-12'>
                        <FormLabel>User Type</FormLabel>
                        <Field as='select' name='user_type' className='w-full px-4 py-2 border rounded-md'>
                          <option value='' label='Select user type' />
                          {userTypes.map((type) => (
                            <option key={type.id} value={type.type}>{type.type}</option>
                          ))}
                        </Field>
                        {errors.user_type && touched.user_type && (
                          <div className='text-red-500'>{errors.user_type}</div>
                        )}
                      </div>
                      <div className='col-span-12'>
                        <div className='flex items-center justify-between gap-3 mb-6'>
                          <Checkbox
                            w18
                            name={'agreeToTerms'}
                            id={'agreeToTerms'}
                            onChange={handleChange}
                            checked={values.agreeToTerms}
                          >
                            I agree to the terms and conditions
                          </Checkbox>
                          {errors.agreeToTerms && touched.agreeToTerms && (
                            <div className='text-red-500'>{errors.agreeToTerms}</div>
                          )}
                        </div>
                      </div>
                      <div className='col-span-12'>
                        <Button primary className={'w-full lg:!py-3'} type='submit' disabled={isSubmitting}>
                          Sign Up
                        </Button>
                      </div>
                      <div className='col-span-12 text-center mt-4'>
                        <Paragraph text12>
                          Already have an account?{' '}
                          <Link
                            to={paths.auth.login}
                            className='font-semibold text-primary-blue hover:text-site-black transition-all duration-300'
                          >
                            Log in
                          </Link>
                        </Paragraph>
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
  );
}

export default SignUp;
