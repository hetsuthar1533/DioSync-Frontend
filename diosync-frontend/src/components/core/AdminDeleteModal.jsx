import React from 'react'
import { IoWarning } from 'react-icons/io5'
import Button from './formComponents/Button'
import Paragraph from './typography/Paragraph'

const AdminDeleteModal = (props) => {
  const { handleCloseDeleteModal, deleteLabel, deleteFunction, headerMsg, deleteBtn, cancelBtn } = props
  return (
    <>
      <div>
        <div className='flex justify-center'>
          <IoWarning className='text-center text-[50px] text-[#EF6162] mb-4' />
        </div>
        <Paragraph text18 className={'text-center'}>
          {deleteLabel ? deleteLabel : 'Are you sure you want to delete?'}
        </Paragraph>
        <div className='mt-5 flex justify-center gap-4'>
          <Button primary onClick={() => deleteFunction()}>
            {deleteBtn ? deleteBtn : 'Delete'}
          </Button>
          <Button secondary onClick={handleCloseDeleteModal}>
            {cancelBtn ? cancelBtn : 'Cancel'}
          </Button>
        </div>
      </div>
    </>
  )
}
export default AdminDeleteModal
