import * as Yup from 'yup'

export const accountValidationSchema = () =>
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
    // username: Yup.string()
    //   .trim()
    //   .max(20, 'Maximum 20 Characters allowed')
    //   .min(1, 'Minimum 1 Characters required')
    //   .required('Last name is required'),
    email: Yup.string()
      .email('Email is invalid')
      .trim()
      .max(255, 'Maximum 255 Characters allowed')
      .required('Email is required')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Email is invalid'),
  })
