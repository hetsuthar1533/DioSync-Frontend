import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import WhiteCard from '../../../components/themeComponents/WhiteCard'
import SearchFilter from '../../../components/core/formComponents/SearchFilter'
import Button from '../../../components/core/formComponents/Button'
import TableLayout from '../../../components/themeComponents/TableLayout'
import Modal from '../../../components/core/Modal'
import AddSubscription from './AddSubscription'
import AdminDeleteModal from '../../../components/core/AdminDeleteModal'
import { BulkAction, BulkActionModel, DELETE, UPDATE } from '../../../constants/roleConstants'
import { DeleteSubscriptionPlans, GetSubscriptionPlans } from '../../../services/subscriptionPlansService'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader, siteLoaderSelector } from '../../../redux/slices/siteLoaderSlice'
import BulkHeader from '../../../components/themeComponents/BulkHeader'
import { deleteToastFun } from '../../../utils/commonHelper'
import { BulkPerformAction } from '../../../services/commonService'
import { generalDataSelector } from '../../../redux/slices/generalDataSlice'

const SubscriptionListing = () => {
  const { generalData } = useSelector(generalDataSelector)
  const tableHeader = [
    {
      key: 'Name',
      value: 'name',
      sorting: true,
      sortkey: 'name',
      clickable: false,
    },
    {
      key: 'Validity',
      value: 'validity',
      sorting: true,
      sortkey: 'validity',
      clickable: false,
    },
    {
      key: 'Price',
      value: 'price',
      sorting: true,
      sortkey: 'price',
      clickable: false,
      cell: ({ price }) => {
        return <>{`${generalData?.currency ?? ''} ${price}`}</>
      },
    },
    {
      key: 'Description',
      value: 'description',
      sorting: false,
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
  const dispatch = useDispatch()
  const loader = useSelector(siteLoaderSelector)
  const [totalItemsOnPage, setTotalItemsOnPage] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [searchItem, setSearchItem] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedAction, setSelectedAction] = useState('')

  useEffect(() => {
    const debounce = setTimeout(() => {
      getSubscriptionPlanData()
    }, 300)

    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getSubscriptionPlanData = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    const response = await GetSubscriptionPlans(queryString)
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    setTotalItemsOnPage(results.length)
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

  const handleSubscription = () => {
    setOpenModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedItem('')
  }

  const handleDeleteSubscriptionPlan = async () => {
    dispatch(showLoader())
    const response = await DeleteSubscriptionPlans(selectedItem)
    if (response?.status === 204) {
      deleteToastFun('Subscription deleted successfully', 'success')
      handleCloseDeleteModal()
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getSubscriptionPlanData()
      }
    } else {
      deleteToastFun('Something went wrong', 'error')
    }
    dispatch(hideLoader())
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

  const handleApplyAction = () => {
    if (selectedAction) {
      switch (selectedAction) {
        case 'active':
          const activeBody = {
            model: BulkActionModel?.subscription_plan,
            ids: selectedIds,
            action: BulkAction?.ACTIVE,
          }
          handleBulkApplyAction(activeBody)
          break
        case 'delete':
          const deleteBody = {
            model: BulkActionModel?.subscription_plan,
            ids: selectedIds,
            action: BulkAction?.DELETED,
          }
          handleBulkApplyAction(deleteBody)
          break
        case 'inactive':
          const inActiveBody = {
            model: BulkActionModel?.subscription_plan,
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
      getSubscriptionPlanData()
      setSelectedIds([])
      setSelectedAction('')
    }
    dispatch(hideLoader())
  }

  const handleSelectAction = (data) => {
    setSelectedAction(data)
  }

  return (
    <>
      <WhiteCard>
        <div className='grid grid-cols-12 gap-4'>
          <BulkHeader
            addName='Add Subscription Plan'
            handleAddFun={handleSubscription}
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
              loader={loader}
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
          headingText={selectedItem?.id ? 'Edit Subscription Plan' : 'Add Subscription Plan'}
          width={'md:w-[700px]'}
        >
          <AddSubscription
            handleCloseModal={handleCloseModal}
            selectedItem={selectedItem}
            getSubscriptionPlanData={getSubscriptionPlanData}
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
            deleteFunction={handleDeleteSubscriptionPlan}
            deleteLabel={'Are you sure you want to delete this Subscription Plan?'}
          />
        </Modal>
      )}
    </>
  )
}
export default SubscriptionListing
