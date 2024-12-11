import React, { useEffect, useState } from 'react'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import Button from '../../components/core/formComponents/Button'
import { FiPlus } from 'react-icons/fi'
import TableLayout from '../../components/themeComponents/TableLayout'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import Modal from '../../components/core/Modal'
import AddSupplier from './AddSupplier'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { deleteToastFun, getLabelByValue } from '../../utils/commonHelper'
import { DeleteSupplierById, GetAllSupplier } from '../../services/SupplierService'
import AdminDeleteModal from '../../components/core/AdminDeleteModal'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function Suppliers() {
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const dispatch = useDispatch()
  const itemsPerPage = 10
  const [open, setOpen] = useState(false)
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [totalItemsOnPage, setTotalItemsOnPage] = useState(0)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [searchItem, setSearchItem] = useState('')
  const [currentItems, setCurrentItems] = useState([])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getSupplierData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getSupplierData = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }

    const response = await GetAllSupplier(queryString, activeVenue)
    dispatch(hideLoader())

    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    setTotalItemsOnPage(results.length) // Update the total items on the current page
    dispatch(hideLoader())
  }
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
        openPopup()
        break
      case DELETE:
        setOpenDeleteModal(true)
        setSelectedItem(item?.id)
        break
      default:
        break
    }
  }

  const openPopup = () => {
    setOpen(!open)
  }
  const closePopup = () => {
    setOpen(false)
    setSelectedItem('')
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedItem('')
  }

  const tableHeader = [
    {
      key: 'Name & Website',
      value: 'name_web',
      sorting: false,
      clickable: false,
      cell: ({ supplier_name, internal_account_id, website }) => {
        return (
          <>
            <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>Name:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{supplier_name}</span>
            </li>
            {internal_account_id && <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>Id:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{internal_account_id}</span>
            </li>}
            {website && <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>Website:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{website}</span>
            </li>}
          </>
        )
      },
    },
    {
      key: 'Contact',
      value: 'contact',
      sorting: false,
      clickable: false,
      cell: ({ ofc_phone_number, cell_phone_number, email }) => {
        return (
          <>
            {ofc_phone_number && <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>Office phone :</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{ofc_phone_number}</span>
            </li>}
            <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>Email ID:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{email}</span>
            </li>
            <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>Cell phone:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{cell_phone_number}</span>
            </li>
          </>
        )
      },
    },
    {
      key: 'Address',
      value: 'address',
      sorting: false,
      clickable: false,
      cell: ({ address, city, state, zip_code }) => {
        return (
          <>
            {/* <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>Address line:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{address}</span>
            </li> */}
            <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>City:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{city?.city_name}</span>
            </li>
            <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>State:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{state?.state_name}</span>
            </li>
            {zip_code && <li className='flex items-center gap-1'>
              <span className='text-dark-grey text-xs leading-[21px] font-semibold'>Zipcode:</span>
              <span className='text-site-black text-sm leading-[21px] font-semibold'>{zip_code}</span>
            </li>}
          </>
        )
      },
    },
    {
      key: 'Rep Name',
      value: 'representative_name',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Avg. delivery Date',
      value: 'avg_delivery_date',
      sorting: false,
      clickable: false,
      cell: ({ avg_delivery_date }) => {
        return <>{getLabelByValue(avg_delivery_date)}</>
      },
    },
    {
      key: 'Mini. order',
      value: 'min_order',
      sorting: false,
      clickable: false,
      cell: ({ min_order }) => {
        return <>{min_order && <span>{`${generalData?.currency ?? ''} ${min_order ?? '--'}`}</span>}</>
      },
    },
    {
      key: 'Actions',
      value: 'actions',
      sorting: false,
      clickable: false,
    },
  ]

  const handleDeleteApiCall = async () => {
    dispatch(showLoader())
    const response = await DeleteSupplierById(selectedItem)
    if (response?.status === 204) {
      deleteToastFun('Supplier deleted successfully', 'success')
      handleCloseDeleteModal()
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getSupplierData()
      }
    } else {
      deleteToastFun('Something went wrong', 'error')
    }
    dispatch(hideLoader())
  }

  return (
    <WhiteCard>
      <div className='flex items-center justify-between md:flex-nowrap flex-wrap gap-3 mb-4'>
        <SearchFilter
          className={'sm:order-1 order-2 sm:w-auto w-full'}
          setSearchItem={setSearchItem}
          searchItem={searchItem}
          setItemOffset={setItemOffset}
          placeholder={'Search'}
          iconRight
          sm
        />
        <Button primary onClick={openPopup} className={'w-full sm:w-auto sm:order-2 order-1'}>
          <FiPlus fontSize={'18px'} /> Add new suppliers
        </Button>
      </div>
      <TableLayout
        tableHeader={tableHeader}
        totalCount={totalCount}
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
      <Modal
        open={open}
        onClose={closePopup}
        header
        headingText={selectedItem?.id ? 'Edit Supplier' : 'Add New Supplier'}
        width={'md:w-[660px]'}
      >
        <AddSupplier handleCloseModal={closePopup} selectedItem={selectedItem} getSupplierData={getSupplierData} />
      </Modal>

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
            deleteFunction={handleDeleteApiCall}
            deleteLabel={'Are you sure you want to delete this supplier?'}
          />
        </Modal>
      )}
    </WhiteCard>
  )
}

export default Suppliers
