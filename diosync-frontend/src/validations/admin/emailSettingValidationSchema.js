import * as Yup from 'yup'

// Define the validation schema
export const emailSettingsValidationSchema = Yup.object().shape({
  mail_driver: Yup.string().required('Mail driver is required'),
  mail_host: Yup.string().required('Mail host is required'),
  mail_port: Yup.number()
    .required('Mail port is required')
    .positive('Mail port must be a positive number')
    .integer('Mail port must be an integer'),
  mail_username: Yup.string().required('Mail username is required'),
  mail_password: Yup.string().required('Mail password is required'),
  from_email: Yup.string()
    .email('Email is invalid')
    .trim()
    .max(255, 'Maximum 255 Characters allowed')
    .required('From email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Email is invalid'),
})
