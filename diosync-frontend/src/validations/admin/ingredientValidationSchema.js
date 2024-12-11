import * as Yup from 'yup'

export const ingredientValidationSchema = () =>
  Yup.object().shape({
    category: Yup.string().required('Category is required'),
    name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Ingredient name is required'),
    price: Yup.string()
      .trim()
      .required('Price is required')
      .matches(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with up to two decimal places'),
  })
