import * as Yup from 'yup'

export const caseSizeValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Name is required'),
    size: Yup.number().nullable().notRequired().min(0).max(100).required('Case Size is required'),
  })
