import * as Yup from 'yup'
import { DOCUMENT_SUPPORTED_FORMATS } from '../../constants/commonConstants'

export const addItemValidationSchema = () =>
  Yup.object().shape({
    image: Yup.lazy((value) => {
      switch (typeof value) {
        case 'string':
          return Yup.string()
        default:
          return Yup.mixed()
            .required('Item image is required')
            .test(
              'size',
              'image size should be less than 5 MB',
              () => !value || (value && value.size <= 1024 * 1024 * 5),
            )
            .test(
              'format',
              'Only the following formats are accepted: .jpeg, .jpg, and .png',
              () => !value || (value && DOCUMENT_SUPPORTED_FORMATS.includes(value.type)),
            )
      }
    }),
    name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Item name is required'),
    brand_name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Brand name is required'),
    category: Yup.string().required('Category name is required'),
    sub_category: Yup.string().required('Subcategory name is required'),
    barcode: Yup.string().trim(), // .required('Barcode is required'),
    unit_size: Yup.number().typeError('Unit size must be a number').required('Unit size is required').min(1),
    case_size: Yup.number().typeError('Case size must be a number').min(1),
    is_active: Yup.string().required('Status name is required'),
  })
