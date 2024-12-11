import * as Yup from 'yup'

export const breakageAndLossValidationSchema = () =>
  Yup.object().shape({
    reason: Yup.string().trim().required('Add reason is required'),
  })
