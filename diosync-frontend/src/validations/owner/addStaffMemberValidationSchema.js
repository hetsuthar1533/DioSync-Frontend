import * as Yup from 'yup'

export const addStaffMemberValidationSchema = () =>
  Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Email is invalid')
      .trim()
      .max(255, 'Maximum 255 Characters allowed')
      .required('Email is required')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Email is invalid'),
    bar_vanue: Yup.string().required('Restaurant is required'),
  })
