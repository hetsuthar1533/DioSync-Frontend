import * as Yup from 'yup'

export const generalSettingsValidationSchema = Yup.object().shape({
  support_name: Yup.string()
    .trim()
    .max(50, 'Maximum 50 characters allowed')
    .min(1, 'Minimum 1 character required')
    .required('Support name is required'),
  support_email: Yup.string()
    .email('Email is invalid')
    .trim()
    .max(255, 'Maximum 255 Characters allowed')
    .required('Support email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Email is invalid'),
  address: Yup.string().trim().required('Address is required'),
  phone_number: Yup.string()
    .matches(/^\d+$/, 'Phone number must be numeric')
    .max(15, 'Maximum 15 digits allowed')
    .min(8, 'Minimum 8 digits required')
    .required('Phone number is required'),
  android_version: Yup.string()
    .matches(/^\d+\.\d+\.\d+$/, 'Invalid version format (expected format: x.y.z)')
    .required('Android version is required'),
  ios_version: Yup.string()
    .matches(/^\d+\.\d+\.\d+$/, 'Invalid version format (expected format: x.y.z)')
    .required('Ios version is required'),
  site_title: Yup.string()
    .trim()
    .max(150, 'Maximum 150 characters allowed')
    .min(1, 'Minimum 1 character required')
    .required('Site title is required'),
  copyright_text: Yup.string().trim().required('Copyright text is required'),
  date_format: Yup.string().trim().required('Date format is required'),
})
