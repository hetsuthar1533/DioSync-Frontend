import * as Yup from 'yup'

export const ChangePasswordValidationSchema = () =>
  Yup.object().shape({
    newPassword: Yup.string()
      .trim()
      .required('New Password is required')
      .matches(/(?=.*[A-Z])/, 'Password needs to have at least one capital letter')
      .matches(/(?=.*[!@#$%^&*])/, 'Password needs to have at least one special character')
      .matches(/(?=.*[a-z])/, 'Password needs to have at least one lower case character')
      .matches(/(?=.*[0-9])/, 'Password needs to have at least one number')
      .min(8, 'Password must contain minimum 8 letters without space')
      .max(15),
    confirmPassword: Yup.string()
      .label('confirm password')
      .required('Confirm Password is required')
      .oneOf([Yup.ref('newPassword') || null], 'Confirm password must match with New Password'),
  })
