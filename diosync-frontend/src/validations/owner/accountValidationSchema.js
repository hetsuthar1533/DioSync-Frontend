import * as Yup from 'yup'

export const accountValidationSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required').max(50, 'First name must be less than 50 characters'),
  last_name: Yup.string().required('Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone_contry_code: Yup.number().required('Phone country code is required'),
  phone_number: Yup.string()
    .min(8, 'Phone number should be 8 to 15 numeric')
    .max(15, 'Phone number should be 8 to 15 numeric')
    .required('Phone number is required'),
  country: Yup.number().required('Country is required'),
  zip_code: Yup.string()
    .matches(/^[0-9]+$/, 'Please enter numeric value only for the Zip Code')
    .trim()
    .min(5, 'Zip code must be from 00000 to 99999')
    .max(5, 'Zip code must be from 00000 to 99999')
    .required('Zip code is required'),
  // time_zone: Yup.number().required('Time zone is required'),
  street_address: Yup.string()
    .required('Street address is required')
    .max(100, 'Street address must be less than 100 characters'),
  currency: Yup.string().required('Currency is required'),
  accounting_report_days: Yup.string().required('Accounting report days are required'),
  shift_mode: Yup.string().oneOf(['Day', 'Night'], 'Invalid shift mode').required('Shift mode is required'),
})
