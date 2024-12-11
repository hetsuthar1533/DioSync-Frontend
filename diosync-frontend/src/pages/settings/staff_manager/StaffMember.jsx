/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Paragraph from '../../../components/core/typography/Paragraph'
import WhiteCard from '../../../components/themeComponents/WhiteCard'
import TableLayout from '../../../components/themeComponents/TableLayout'
import SearchFilter from '../../../components/core/formComponents/SearchFilter'
import { DELETE, UPDATE } from '../../../constants/roleConstants'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteStaffeMemberById, GetAllStaffMember } from '../../../services/staffService'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'
import Modal from '../../../components/core/Modal'
import AdminDeleteModal from '../../../components/core/AdminDeleteModal'
import AddStaffMember from './AddStaffMember'
import { hideData, loadDataSelector } from '../../../redux/slices/loadDataSlice'

function StaffMember() {
  const tableHeader = [
    {
      key: 'Name',
      value: 'name',
      sorting: false,
      clickable: false,
      cell: ({ last_name, first_name }) => {
        return <>{`${first_name} ${last_name}`}</>
      },
    },
    {
      key: 'Email',
      value: 'email',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Restaurant name',
      value: 'restaurant_name',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Last inventory date',
      value: 'last_inventory_date',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Actions',
      value: 'actions',
      sorting: false,
      clickable: false,
    },
  ]
  const loadData = useSelector(loadDataSelector)
  const dispatch = useDispatch()
  const [totalItemsOnPage, setTotalItemsOnPage] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [searchItem, setSearchItem] = useState('')
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    const debounce = setTimeout(() => {
      getAllStaffMemberData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  useEffect(() => {
    if (loadData) {
      getAllStaffMemberData()
    }
  }, [loadData])

  const getAllStaffMemberData = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }

    const response = await GetAllStaffMember(queryString)
    dispatch(hideLoader())

    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    setTotalItemsOnPage(results.length) // Update the total items on the current page
    dispatch(hideLoader())
    dispatch(hideData())
  }

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage
    setItemOffset(newOffset)
  }

  const handleSorting = (data, order) => {
    setOrderby(data)
    setOrder(order)
  }

  const handleOptions = (optionValue, item) => {
    switch (optionValue) {
      case UPDATE:
        setSelectedItem(item)
        setOpenModal(true)
        break
      case DELETE:
        setOpenDeleteModal(true)
        setSelectedItem(item?.id)
        break
      default:
        break
    }
  }
  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedItem('')
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedItem('')
  }

  const handleDeleteStaffMember = async () => {
    dispatch(showLoader())
    const response = await DeleteStaffeMemberById(selectedItem)
    if (response?.status === 200) {
      handleCloseDeleteModal()
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getAllStaffMemberData()
      }
    }
    dispatch(hideLoader())
  }

  return (
    <WhiteCard>
      <div className='grid grid-cols-12 sm:gap-4 gap-3 items-center'>
        <div className='md:col-span-6 col-span-12'>
          <Paragraph text20>List of staff member</Paragraph>
        </div>
        <div className='md:col-span-6 col-span-12'>
          <div className='flex items-center justify-end sm:flex-nowrap flex-wrap sm:gap-4 gap-3'>
            <SearchFilter
              setSearchItem={setSearchItem}
              searchItem={searchItem}
              setItemOffset={setItemOffset}
              placeholder={'Search'}
              className={'sm:w-auto w-full'}
              iconRight
              sm
            />
          </div>
        </div>

        <div className='col-span-12'>
          <TableLayout
            totalCount={totalCount}
            tableHeader={tableHeader}
            handleOptions={handleOptions}
            currentItems={currentItems}
            isEdit={true}
            isDelete={true}
            isView={false}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            itemOffset={itemOffset}
            itemsPerPage={itemsPerPage}
            handleSorting={handleSorting}
          />
        </div>
      </div>

      {openModal && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          header
          headingText={selectedItem?.id ? 'Edit Bar Staff' : 'Add Bar Staff'}
          width={'md:w-[700px]'}
        >
          <AddStaffMember
            onClose={handleCloseModal}
            selectedItem={selectedItem}
            getAllStaffMemberData={getAllStaffMemberData}
          />
        </Modal>
      )}
      {openDeleteModal && (
        <Modal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          headingText={'Delete Confirmation'}
          width={'md:w-[700px]'}
        >
          <AdminDeleteModal
            openDeleteModal={openDeleteModal}
            handleCloseDeleteModal={handleCloseDeleteModal}
            deleteFunction={handleDeleteStaffMember}
            deleteLabel={'Are you sure you want to delete this staff member?'}
          />
        </Modal>
      )}
    </WhiteCard>
  )
}

export default StaffMember
