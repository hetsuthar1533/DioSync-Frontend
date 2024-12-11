import * as Yup from 'yup'

export const AddSubscriptionPlanValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 characters allowed')
      .min(1, 'Minimum 1 character required')
      .required('Plan name is required'),
    validity: Yup.string().required('Plan validity is required'),
    price: Yup.string()
      .trim()
      .required('Plan price is required')
      .matches(/^\d+(\.\d{1,2})?$/, 'Plan price must be a valid number with up to two decimal places'),
    description: Yup.string()
      .trim()
      .max(200, 'Maximum 200 characters allowed')
      .required('Plan description is required'),
  })
