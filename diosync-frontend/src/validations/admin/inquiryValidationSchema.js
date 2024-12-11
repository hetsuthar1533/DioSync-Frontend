import * as Yup from 'yup'

export const InquiryValidationSchema = () =>
  Yup.object().shape({
    message: Yup.string().required('Required'),
  })
