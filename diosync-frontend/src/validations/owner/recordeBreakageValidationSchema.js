import * as Yup from 'yup'

export const recordBreakageValidationSchema = () =>
  Yup.object().shape({
    date: Yup.date().required('Date and time is required').typeError('Invalid date'),
    type: Yup.string().required('Breakage type is required'),
    employee: Yup.string().required('Employee is required'),
    note: Yup.string().required('Note is required').max(200, 'Note cannot be more than 200 characters long'),
  })
