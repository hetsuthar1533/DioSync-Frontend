import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BulkAction, BulkActionModel, DELETE, UPDATE, tableFilter } from '../../../../constants/roleConstants'
import TableLayout from '../../../../components/themeComponents/TableLayout'
import Button from '../../../../components/core/formComponents/Button'
import Modal from '../../../../components/core/Modal'
import AddCategory from './AddCategory'
import AdminDeleteModal from '../../../../components/core/AdminDeleteModal'
import WhiteCard from '../../../../components/themeComponents/WhiteCard'
import SearchFilter from '../../../../components/core/formComponents/SearchFilter'
import { FiPlus } from 'react-icons/fi'
import { DeleteCategories, GetCategories } from '../../../../services/categoryService'
import { deleteToastFun } from '../../../../utils/commonHelper'
import { showLoader, hideLoader, siteLoaderSelector } from '../../../../redux/slices/siteLoaderSlice'
import SelectType from '../../../../components/core/formComponents/SelectType'
import BulkHeader from '../../../../components/themeComponents/BulkHeader'
import { BulkPerformAction } from '../../../../services/commonService'

function CategoryListing() {
  const tableHeader = [
    {
      key: 'Category',
      value: 'name',
      sorting: true,
      sortkey: 'name',
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
  const [order, setOrder] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [searchItem, setSearchItem] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedAction, setSelectedAction] = useState('')

  useEffect(() => {
    const debounce = setTimeout(() => {
      getCategoriesData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  const getCategoriesData = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }

    const response = await GetCategories(queryString)
    dispatch(hideLoader())

    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    setTotalItemsOnPage(results.length) // Update the total items on the current page
    dispatch(hideLoader())
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

  const handleAddCategory = () => {
    setOpenModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedItem('')
  }

  const handleDeleteCategory = async () => {
    dispatch(showLoader())
    const response = await DeleteCategories(selectedItem)
    if (response?.status === 204) {
      deleteToastFun('Category deleted successfully', 'success')
      handleCloseDeleteModal()
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getCategoriesData()
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
            model: BulkActionModel?.category,
            ids: selectedIds,
            action: BulkAction?.ACTIVE,
          }
          handleBulkApplyAction(activeBody)
          break
        case 'delete':
          const deleteBody = {
            model: BulkActionModel?.category,
            ids: selectedIds,
            action: BulkAction?.DELETED,
          }
          handleBulkApplyAction(deleteBody)
          break
        case 'inactive':
          const inActiveBody = {
            model: BulkActionModel?.category,
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
      getCategoriesData()
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
        <div className='grid grid-cols-12 sm:gap-4 gap-3 items-center'>
          <BulkHeader
            addName='Add Category'
            handleAddFun={handleAddCategory}
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
              handleSorting={handleSorting}
              pageCount={pageCount}
              itemOffset={itemOffset}
              itemsPerPage={itemsPerPage}
              handlePageClick={handlePageClick}
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
          headingText={selectedItem?.id ? 'Edit Category' : 'Add Category'}
          width={'md:w-[700px]'}
        >
          <AddCategory
            handleCloseModal={handleCloseModal}
            selectedItem={selectedItem}
            getCategoriesData={getCategoriesData}
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
            deleteFunction={handleDeleteCategory}
            deleteLabel={'Are you sure you want to delete this category?'}
          />
        </Modal>
      )}
    </>
  )
}

export default CategoryListing
