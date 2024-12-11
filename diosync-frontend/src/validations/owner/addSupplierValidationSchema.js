import * as Yup from 'yup'

const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{8,15}$/

export const addSupplierValidationSchema = () =>
  Yup.object().shape({
    supplier_name: Yup.string().required('Supplier name is required'),
    account_number: Yup.string().nullable(), //.required('Account number is required'),
    ofc_phone_number: Yup.string().matches(phoneRegExp, 'Office phone number is not valid'),
    // .required('Office phone number is required'),
    website: Yup.string().url('Invalid website URL'), //.required('Website is required'),
    internal_account_id: Yup.string(), //.required('Internal account ID is required'),
    address: Yup.string(), //.required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip_code: Yup.string()
      .matches(/^[0-9]+$/, 'Please enter numeric value only for the Zip Code')
      .trim()
      .min(5, 'Zip code must be from 00000 to 99999')
      .max(5, 'Zip code must be from 00000 to 99999'),
    //.required('Zip code is required'),
    representative_name: Yup.string().required('Representative name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    cell_phone_number: Yup.string()
      .matches(phoneRegExp, 'Cell phone number is not valid')
      .required('Cell phone number is required'),
    delivery_day: Yup.array()
      .transform((value) => (typeof value === 'string' ? value.split(',') : value))
      .of(Yup.string().required('Each selected delivery day must be valid'))
      .min(1, 'At least one delivery day is required')
      .required('Delivery day is required'),
    avg_delivery_date: Yup.string().required('Average delivery date is required'),
    // min_order: Yup.number().min(1, 'Minimum order is 1').required('Minimum order is required'),
  })
