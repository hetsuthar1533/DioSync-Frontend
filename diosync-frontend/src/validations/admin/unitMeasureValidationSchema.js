import * as Yup from 'yup'

export const unitMeasureValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().trim().required('Unit measure is required'),
    value_into_gm: Yup.number()
      .typeError('Value must be a number')
      .positive('Value must be greater than zero')
      .min(0.1, 'Value must be at least 0.1 grams') // Adjust as needed
      .required('Value in grams is required'),
  })
