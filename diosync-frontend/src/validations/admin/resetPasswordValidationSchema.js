import * as Yup from 'yup'

export const CurrentPasswordValidation = () =>
  Yup.string()
    .trim()
    .required('Old Password is required')
    .matches(/(?=.*[A-Z])/, 'Password needs to have at least one capital letter')
    .matches(/(?=.*[!@#$%^&*])/, 'Password needs to have at least one special character')
    .matches(/(?=.*[a-z])/, 'Password needs to have at least one lower case character')
    .matches(/(?=.*[0-9])/, 'Password needs to have at least one number')
    .min(8, 'Password must contain minimum 8 letters without space')
    .max(15)

export const NewPasswordValidation = () =>
  Yup.string()
    .trim()
    .required('New Password is required')
    .matches(/(?=.*[A-Z])/, 'Password needs to have at least one capital letter')
    .matches(/(?=.*[!@#$%^&*])/, 'Password needs to have at least one special character')
    .matches(/(?=.*[a-z])/, 'Password needs to have at least one lower case character')
    .matches(/(?=.*[0-9])/, 'Password needs to have at least one number')
    .min(8, 'Password must contain minimum 8 letters without space')
    .max(15)

export const ConfirmPasswordValidation = () =>
  Yup.string()
    .label('confirm password')
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password') || null], 'Confirm password must match with New Password')

export const resetPasswordValidationSchema = () =>
  Yup.object().shape({
    old_password: CurrentPasswordValidation(),
    new_password: NewPasswordValidation(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('new_password'), ''], 'Passwords must match')
      .required('Confirm password is required'),
  })
