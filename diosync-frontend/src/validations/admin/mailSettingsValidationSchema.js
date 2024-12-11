import * as Yup from 'yup'

export const mailSettingsValidationSchema = () =>
  Yup.object().shape({
    category: Yup.string().required('Category is required'),
    ingredient: Yup.string()
      .trim()
      .max(20, 'Maximum 20 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Ingredient is required'),
    price: Yup.string()
      .trim()
      .max(20, 'Maximum 20 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Price is required'),
  })
