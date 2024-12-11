import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import FormLabel from '../../../../components/core/typography/FormLabel'
import Paragraph from '../../../../components/core/typography/Paragraph'
import Button from '../../../../components/core/formComponents/Button'
import { Form, Formik } from 'formik'
import { InquiryValidationSchema } from '../../../../validations/admin/inquiryValidationSchema'
import { useDispatch } from 'react-redux'
import { replyContactedInquiries } from '../../../../services/inquiryService'
import { hideLoader, showLoader } from '../../../../redux/slices/siteLoaderSlice'

function ViewContactUsInquiry({ handleCloseModal, selectedItem, getContactusData }) {
  const dispatch = useDispatch()
  const initialValues = {
    message: '',
  }
  const [replyMesg, setReplyMesg] = useState(false)
  const [showError, setShowError] = useState(false)

  const onSubmit = async (data) => {
    dispatch(showLoader())
    const response = await replyContactedInquiries(data, selectedItem?.id)
    if (response?.data?.status === 200) {
      handleCloseModal()
      getContactusData()
    }
    dispatch(hideLoader())
  }

  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className='md:col-span-6 col-span-12'>
        <FormLabel>User Name</FormLabel>
        <Paragraph text16>{selectedItem?.user_name ?? '--'}</Paragraph>
      </div>
      <div className='md:col-span-6 col-span-12'>
        <FormLabel>User Email</FormLabel>
        <Paragraph text16>{selectedItem?.email ?? '--'}</Paragraph>
      </div>
      <div className='md:col-span-6 col-span-12'>
        <FormLabel>User phone number</FormLabel>
        <Paragraph text16>{selectedItem?.phone_number ?? '--'}</Paragraph>
      </div>
      <div className='col-span-12'>
        <FormLabel>Message</FormLabel>
        <Paragraph text16>{selectedItem?.message ?? '--'}</Paragraph>
      </div>
      <div className='col-span-12'>
        {/* for reply implement */}
        {!selectedItem?.is_replied && (
          <Formik initialValues={initialValues} validationSchema={InquiryValidationSchema} onSubmit={onSubmit}>
            {({ setFieldValue, errors, touched }) => (
              <Form>
                <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3'>
                  {replyMesg && (
                    <div className='col-span-12'>
                      <FormLabel>{`Reply to ${selectedItem?.email}`}</FormLabel>
                      <ReactQuill
                        theme='snow'
                        name='message'
                        onBlur={() => setShowError(true)}
                        onChange={(value) => setFieldValue('message', value)}
                        placeholder='I hope this email finds you well.'
                        className='px-0 mt-2'
                      />
                      {showError && touched.message && errors.message && (
                        <div className='text-site-red text-sm font-medium'>{errors.message}</div>
                      )}
                    </div>
                  )}
                  <div className='col-span-12'>
                    <div className='flex items-center justify-end gap-4'>
                      <Button secondary onClick={() => setReplyMesg(!replyMesg)} className={'w-full md:w-auto'}>
                        {replyMesg ? 'Cancel' : 'Reply'}
                      </Button>
                      {replyMesg && (
                        <Button type='submit' primary className={'w-full md:w-auto'}>
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  )
}

export default ViewContactUsInquiry
