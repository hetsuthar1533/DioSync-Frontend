import * as Yup from 'yup'

export const recordTransferValidationSchema = () =>
  Yup.object().shape({
    transferLocation: Yup.string().required('Transfer location is required').nullable(),
    date: Yup.date().required('Date and time is required').typeError('Invalid date'),
    note: Yup.string().required('Note is required').max(200, 'Note cannot be more than 200 characters long'),
  })
