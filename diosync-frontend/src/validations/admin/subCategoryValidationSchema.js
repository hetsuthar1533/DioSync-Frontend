import * as Yup from 'yup'

export const subCategoryValidationSchema = () =>
  Yup.object().shape({
    category: Yup.string().required('Category is required'),
    sub_category_name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Sub category is required'),
  })
