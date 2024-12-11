import React, { useEffect, useState } from 'react'
import WhiteCard from '../../../../components/themeComponents/WhiteCard'
import SearchFilter from '../../../../components/core/formComponents/SearchFilter'
import Button from '../../../../components/core/formComponents/Button'
import { FiPlus } from 'react-icons/fi'
import TableLayout from '../../../../components/themeComponents/TableLayout'
import { BulkAction, BulkActionModel, DELETE, UPDATE } from '../../../../constants/roleConstants'
import Modal from '../../../../components/core/Modal'
import AddBarOwnerVenue from './AddBarOwnerVenue'
import { useParams } from 'react-router-dom'
import { DeleteVenueById, GetBarOwnersVenues } from '../../../../services/barOwnerService'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../../redux/slices/siteLoaderSlice'
import AdminDeleteModal from '../../../../components/core/AdminDeleteModal'
import { deleteToastFun } from '../../../../utils/commonHelper'
import moment from 'moment'
import BulkHeader from '../../../../components/themeComponents/BulkHeader'
import { BulkPerformAction } from '../../../../services/commonService'

const BarOwnerVenues = () => {
  const itemsPerPage = 10
  const dispatch = useDispatch()
  const { ownerId } = useParams()
  const [searchItem, setSearchItem] = useState('')
  const [currentItems, setCurrentItems] = useState([])
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [totalItemsOnPage, setTotalItemsOnPage] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedAction, setSelectedAction] = useState('')

  const tableHeader = [
    {
      key: 'Venue name',
      value: 'name',
      sorting: true,
      sortkey: 'name',
      clickable: false,
    },
    {
      key: 'Bar owner',
      value: 'email',
      sorting: false,
      sortkey: 'email',
      clickable: false,
      cell: ({ bar_owner }) => {
        return <>{bar_owner ? bar_owner?.first_name + ' ' + bar_owner?.last_name : '--'}</>
      },
    },
    {
      key: 'Plan purchase date',
      value: 'plan_purchase_date',
      sorting: false,
      sortkey: 'plan_purchase_date',
      clickable: false,
      cell: ({ plan_purchase_date }) => {
        return <>{moment.utc(new Date(plan_purchase_date)).local().format('lll')}</>
      },
    },
    {
      key: 'Plan expire date',
      value: 'plan_expire_date',
      sorting: false,
      sortkey: 'plan_expire_date',
      clickable: false,
      cell: ({ plan_expire_date }) => {
        return <>{moment.utc(new Date(plan_expire_date)).local().format('lll')}</>
      },
    },
    {
      key: 'Plan validity',
      value: 'subscription_plan.validity',
      sorting: true,
      sortkey: 'subscription_plan__validity',
      clickable: false,
      cell: ({ subscription_plan }) => {
        return <>{`${subscription_plan.validity} Month`}</>
      },
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
      getAllBarOwnersVenues()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const handleAddVenue = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedItem('')
  }
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedItem('')
  }

  const handleSorting = (data, order) => {
    setOrderby(data)
    setOrder(order)
  }

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage
    setItemOffset(newOffset)
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

  const getAllBarOwnersVenues = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }

    const response = await GetBarOwnersVenues(ownerId, queryString)
    dispatch(hideLoader())

    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    setTotalItemsOnPage(results.length) // Update the total items on the current page
    dispatch(hideLoader())
  }

  const handleDeleteVenue = async () => {
    dispatch(showLoader())
    const response = await DeleteVenueById(selectedItem)
    if (response?.status === 204) {
      deleteToastFun('Venue deleted successfully', 'success')
      handleCloseDeleteModal()
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getAllBarOwnersVenues()
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
            model: BulkActionModel?.bar_vanue,
            ids: selectedIds,
            action: BulkAction?.ACTIVE,
          }
          handleBulkApplyAction(activeBody)
          break
        case 'delete':
          const deleteBody = {
            model: BulkActionModel?.bar_vanue,
            ids: selectedIds,
            action: BulkAction?.DELETED,
          }
          handleBulkApplyAction(deleteBody)
          break
        case 'inactive':
          const inActiveBody = {
            model: BulkActionModel?.bar_vanue,
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
  const handleBulkApplyAction = async (data) => {
    dispatch(showLoader())
    const response = await BulkPerformAction(data)
    if (response?.status === 200) {
      getAllBarOwnersVenues()
      setSelectedIds([])
      setSelectedAction('')
    }
    dispatch(hideLoader())
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

  return (
    <div>
      <WhiteCard>
        <div className='grid grid-cols-12 gap-4'>
          <BulkHeader
            addName='Add bar venue'
            handleAddFun={handleAddVenue}
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
              isEdit={true}
              isDelete={true}
              isView={false}
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
          headingText={selectedItem?.id ? 'Edit Bar Owner venue' : 'Add Bar Owner Venue'}
          width={'md:w-[700px]'}
        >
          <AddBarOwnerVenue
            onClose={handleCloseModal}
            selectedItem={selectedItem}
            ownerId={ownerId}
            getAllBarOwnersVenues={getAllBarOwnersVenues}
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
            deleteFunction={handleDeleteVenue}
            deleteLabel={'Are you sure you want to delete this venue?'}
          />
        </Modal>
      )}
    </div>
  )
}

export default BarOwnerVenues
