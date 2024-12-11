import * as Yup from 'yup'

export const addOwnerValidationSchema = () =>
  Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .max(20, 'Maximum 20 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('First name is required'),
    last_name: Yup.string()
      .trim()
      .max(20, 'Maximum 20 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Last name is required'),
    email: Yup.string()
      .email('Email is invalid')
      .trim()
      .max(255, 'Maximum 255 Characters allowed')
      .required('Email is required')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Email is invalid'),
    phone_number: Yup.string()
      .matches(/^\d+$/, 'Phone number must be numeric')
      .max(15, 'Maximum 15 digits allowed')
      .min(8, 'Minimum 8 digits required')
      .required('Phone number is required'),
    // costAlert: Yup.number()
    //   .min(0, 'Cost alert must be at least 0')
    //   .max(100, 'Cost alert cannot exceed 100')
    //   .required('Cost alert is required'),
    subscription_plan: Yup.string().required('Subscription plan is required'),
    name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/, 'Venue name only letters and numbers are allowed')
      .min(3, 'Venue name is too short')
      .required('Venue name is required'),
    address: Yup.string()
      .required('Venue address is required')
      .min(5, 'Venue address is too short')
      .max(150, 'Venue address is too long'),
  })

export const editOwnerValidationSchema = () =>
  Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .max(20, 'Maximum 20 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('First name is required'),
    last_name: Yup.string()
      .trim()
      .max(20, 'Maximum 20 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Last name is required'),
    email: Yup.string()
      .email('Email is invalid')
      .trim()
      .max(255, 'Maximum 255 Characters allowed')
      .required('Email is required')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Email is invalid'),
    // costAlert: Yup.number()
    //   .min(0, 'Cost alert must be at least 0')
    //   .max(100, 'Cost alert cannot exceed 100')
    //   .required('Cost alert is required'),
  })

export const addOwnerVenueValidationSchema = () =>
  Yup.object().shape({
    subscription_plan: Yup.string().required('Subscription plan is required'),
    venue_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/, 'Venue name only letters and numbers are allowed')
      .min(3, 'Venue name is too short')
      .required('Venue name is required'),
    address: Yup.string()
      .required('Venue address is required')
      .min(5, 'Venue address is too short')
      .max(150, 'Venue address is too long'),
  })
