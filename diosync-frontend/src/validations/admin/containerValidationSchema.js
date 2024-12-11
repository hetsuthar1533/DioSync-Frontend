import * as Yup from 'yup'

export const containerValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Container name is required'),
  })
