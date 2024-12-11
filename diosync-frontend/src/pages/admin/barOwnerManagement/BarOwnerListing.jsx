import React, { useEffect, useState } from 'react'
import { BulkAction, BulkActionModel, DELETE, LOGINUSER, UPDATE, VIEW } from '../../../constants/roleConstants'
import TableLayout from '../../../components/themeComponents/TableLayout'
import Button from '../../../components/core/formComponents/Button'
import Modal from '../../../components/core/Modal'
import AdminDeleteModal from '../../../components/core/AdminDeleteModal'
import WhiteCard from '../../../components/themeComponents/WhiteCard'
import { FiPlus } from 'react-icons/fi'
import SearchFilter from '../../../components/core/formComponents/SearchFilter'
import AddBarOwner from './AddBarOwner'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'
import { DeleteBarOwner, GetBarOwners, GetLoginBarOwnerUserCreds } from '../../../services/barOwnerService'
import { deleteToastFun } from '../../../utils/commonHelper'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../../routes/path'
import BulkHeader from '../../../components/themeComponents/BulkHeader'
import { BulkPerformAction } from '../../../services/commonService'
import { setRefreshToken, setToken } from '../../../redux/slices/userSlice'

function BarOwnerListing() {
  const itemsPerPage = 10
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [searchItem, setSearchItem] = useState('')
  const [totalItemsOnPage, setTotalItemsOnPage] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedAction, setSelectedAction] = useState('')

  const tableHeader = [
    {
      key: 'First name',
      value: 'first_name',
      sorting: true,
      sortkey: 'first_name',
      clickable: false,
    },
    {
      key: 'Last name',
      value: 'last_name',
      sorting: true,
      sortkey: 'last_name',
      clickable: false,
    },
    {
      key: 'Email',
      value: 'email',
      sorting: true,
      sortkey: 'email',
      clickable: false,
    },
    {
      key: 'Phone number',
      value: 'phone_number',
      sorting: true,
      sortkey: 'phone_number',
      clickable: false,
    },
    { key: 'Status', value: 'is_active', sorting: true, sortkey: 'is_active', clickable: false },
    {
      key: 'Actions',
      value: 'actions',
      sorting: false,
      clickable: false,
    },
  ]

  useEffect(() => {
    const debounce = setTimeout(() => {
      getBarOwners()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  const getBarOwners = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }

    const response = await GetBarOwners(queryString)
    dispatch(hideLoader())

    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    setTotalItemsOnPage(results.length) // Update the total items on the current page
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
      case LOGINUSER:
        handleBarOwnerLogin(item?.id)
        break
      case VIEW:
        navigate(`${paths?.admin?.barOwnerVenue}/${item?.id}`)
      // case UPDATE:
      //   setSelectedItem(item)
      //   setOpenModal(true)
      //   break
      case DELETE:
        setOpenDeleteModal(true)
        setSelectedItem(item?.id)
        break
      default:
        break
    }
  }

  const handleBarOwnerLogin = async (id) => {
    if (id) {
      const response = await GetLoginBarOwnerUserCreds(id)
      if (response?.status === 200) {
        // sessionStorage.setItem('access', response?.data?.data?.access)
        // sessionStorage.setItem('refresh', response?.data?.data?.refresh)
        const queryParams = new URLSearchParams({
          access: btoa(response?.data?.data?.access),
          refresh: btoa(response?.data?.data?.refresh),
        }).toString()
        window.open(`${paths?.auth?.loginUser}?${queryParams}`, '_blank', 'noopener')
      }
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedItem('')
  }

  const handleAddOwner = () => {
    setOpenModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedItem('')
  }

  const handleDeleteOwner = async () => {
    dispatch(showLoader())
    const response = await DeleteBarOwner(selectedItem)
    if (response?.status === 204) {
      deleteToastFun('Owner deleted  successfully', 'success')
      handleCloseDeleteModal()
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getBarOwners()
      }
    } else {
      deleteToastFun('Something went wrong', 'error')
    }
    dispatch(hideLoader())
  }

  const handleApplyAction = () => {
    if (selectedAction) {
      switch (selectedAction) {
        case 'active':
          const activeBody = {
            model: BulkActionModel?.bar_owner,
            ids: selectedIds,
            action: BulkAction?.ACTIVE,
          }
          handleBulkApplyAction(activeBody)
          break
        case 'delete':
          const deleteBody = {
            model: BulkActionModel?.bar_owner,
            ids: selectedIds,
            action: BulkAction?.DELETED,
          }
          handleBulkApplyAction(deleteBody)
          break
        case 'inactive':
          const inActiveBody = {
            model: BulkActionModel?.bar_owner,
            ids: selectedIds,
            action: BulkAction?.INACTIVE,
          }
          handleBulkApplyAction(inActiveBody)
          break
        default:
          break
      }
    }
  }

  const handleSelectAction = (data) => {
    setSelectedAction(data)
  }

  const handleBulk = (data) => {
    const updatedSelectedIds = selectedIds?.includes(data.id)
      ? selectedIds?.filter((id) => id !== data.id)
      : [...selectedIds, data.id]

    setSelectedIds(updatedSelectedIds)
  }

  const handleAllBulk = (data) => {
    if (selectedIds?.length === data?.length) {
      setSelectedIds([])
    } else {
      const allIds = data?.map((item) => item.id)
      setSelectedIds(allIds)
    }
  }

  const handleBulkApplyAction = async (data) => {
    dispatch(showLoader())
    const response = await BulkPerformAction(data)
    if (response?.status === 200) {
      getBarOwners()
      setSelectedIds([])
      setSelectedAction('')
    }
    dispatch(hideLoader())
  }

  return (
    <>
      <WhiteCard>
        <div className='grid grid-cols-12 gap-4'>
          <BulkHeader
            addName='Add Bar Owner'
            handleAddFun={handleAddOwner}
            selectedIds={selectedIds}
            setSearchItem={setSearchItem}
            searchItem={searchItem}
            selectedAction={selectedAction}
            handleSelectAction={handleSelectAction}
            handleApplyAction={handleApplyAction}
          />
          <div className='col-span-12'>
            <TableLayout
              tableHeader={tableHeader}
              totalCount={totalCount}
              handleOptions={handleOptions}
              currentItems={currentItems}
              isEdit={false} // for edit change
              isDelete={true}
              isView={true}
              isLoginButton={true}
              handlePageClick={handlePageClick}
              pageCount={pageCount}
              itemOffset={itemOffset}
              itemsPerPage={itemsPerPage}
              handleSorting={handleSorting}
              handleBulk={handleBulk}
              handleAllBulk={handleAllBulk}
              selectedIds={selectedIds}
              isBulkActive={true}
            />
          </div>
        </div>
      </WhiteCard>
      {openModal && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          header
          headingText={selectedItem?.id ? 'Edit Bar Owner' : 'Add Bar Owner'}
          width={'md:w-[700px]'}
        >
          <AddBarOwner onClose={handleCloseModal} selectedItem={selectedItem} getBarOwners={getBarOwners} />
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
            deleteFunction={handleDeleteOwner}
            deleteLabel={'Are you sure you want to delete this bar owner?'}
          />
        </Modal>
      )}
    </>
  )
}

export default BarOwnerListing
