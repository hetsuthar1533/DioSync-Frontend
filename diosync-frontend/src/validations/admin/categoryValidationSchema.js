import * as Yup from 'yup'

export const categoryValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Category name is required'),
  })
