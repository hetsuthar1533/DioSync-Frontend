import React, { useEffect, useState } from 'react'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import SelectType from '../../components/core/formComponents/SelectType'
import TableLayout from '../../components/themeComponents/TableLayout'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import productImage from '../../assets/images/product_item_one.svg'
import Paragraph from '../../components/core/typography/Paragraph'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import { useDispatch, useSelector } from 'react-redux'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { useNavigate } from 'react-router-dom'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { DeleteYourcartItem, GetCartData, UpdateCartData } from '../../services/cartService'
import noImage from '../../assets/images/noImg.png'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { generalDataSelector, setGeneral } from '../../redux/slices/generalDataSlice'
import { GetGeneralData } from '../../services/commonService'
import { deleteToastFun } from '../../utils/commonHelper'
import Modal from '../../components/core/Modal'
import AdminDeleteModal from '../../components/core/AdminDeleteModal'

function YourCart({ setShowButton }) {
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchItem, setSearchItem] = useState('')
  const itemsPerPage = 10
  const [cartData, setCartData] = useState([])
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [currentItems, setCurrentItems] = useState([])
  const [totalItemsOnPage, setTotalItemsOnPage] = useState(0)
  const [selectedItem, setSelectedItem] = useState()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  useEffect(() => {
    const debounce = setTimeout(() => {
      getCartData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const tableHeader = [
    {
      key: 'Items name',
      value: 'item_name',
      sorting: false,
      sortkey: 'item_name',
      clickable: false,
      cell: ({ item }) => {
        return (
          <div className='flex items-center gap-5'>
            <img
              src={item?.item_image ? item?.item_image : noImage}
              alt='product-img'
              className='w-10 h-10 flex-shrink-0'
            />
            <p>
              <span className='block'>{item?.item_name ?? '--'}</span>
              {item?.unit_size && (
                <span className='block text-xs text-dark-grey'>{`${item?.unit_size ?? '-'} ${item?.unit_of_measure?.name ?? '-'}`}</span>
              )}
            </p>
          </div>
        )
      },
    },
    {
      key: 'Unit Price',
      value: 'cost_price',
      sorting: true,
      sortkey: 'cost_price',
      clickable: false,
      cell: ({ item }) => {
        return <div>{`${generalData?.currency ?? ''} ${Number(item?.cost_price)?.toFixed(2) ?? 0}`}</div>
      },
    },
    {
      key: 'Total Price',
      value: 'total_price',
      sorting: true,
      sortkey: 'total_price',
      clickable: false,
      cell: ({ total_price }) => {
        return <div>{`${generalData?.currency ?? ''} ${Number(total_price)?.toFixed(2)}`}</div>
      },
    },
    {
      key: 'Quantity',
      value: 'qty_of_unit',
      sorting: false,
      clickable: false,
      cell: ({ qty_of_unit, item, qty_of_case }) => {
        return (
          <>
            {item?.case_size === null && (
              <>
                Full Unit
                <div className='flex items-center justify-between rounded-[10px] border border-medium-grey p-1 mb-3'>
                  <button
                    className='w-8 h-8 rounded-[4px] bg-light-grey text-site-black flex items-center justify-center'
                    onClick={() => {
                      handleDecrementCartItem(item?.id, qty_of_unit, qty_of_case)
                    }}
                  >
                    <FiMinus />
                  </button>
                  <span className='text-site-black text-xl leading-[30px] font-bold'>{qty_of_unit}</span>
                  <button
                    className='w-8 h-8 rounded-[4px] bg-light-grey text-site-black flex items-center justify-center'
                    onClick={() => handleIncrementCartItem(item?.id, qty_of_unit, qty_of_case)}
                  >
                    <FiPlus />
                  </button>
                </div>
              </>
            )}
          </>
        )
      },
    },
    {
      key: 'case',
      value: 'qty_of_case',
      sorting: false,
      clickable: false,
      cell: ({ qty_of_case, qty_of_unit, item }) => {
        return (
          <>
            {item?.case_size && (
              <>
                case of {item?.case_size?.size}
                <div className='flex items-center justify-between rounded-[10px] border border-medium-grey p-1 mb-3'>
                  <button
                    className='w-8 h-8 rounded-[4px] bg-light-grey text-site-black flex items-center justify-center'
                    onClick={() => handleDecrementCaseCartItem(item?.id, qty_of_case, qty_of_unit)}
                  >
                    <FiMinus />
                  </button>
                  <span className='text-site-black text-xl leading-[30px] font-bold'>{qty_of_case}</span>
                  <button
                    className='w-8 h-8 rounded-[4px] bg-light-grey text-site-black flex items-center justify-center'
                    onClick={() => handleIncrementCaseCartItem(item?.id, qty_of_case, qty_of_unit)}
                  >
                    <FiPlus />
                  </button>
                </div>
              </>
            )}
          </>
        )
      },
    },
    // {
    //   key: 'Actions',
    //   value: 'actions',
    //   sorting: false,
    //   clickable: false,
    // },
  ]

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
        break
      case DELETE:
        setOpenDeleteModal(true)
        setSelectedItem(item?.id)
        break
      default:
        break
    }
  }

  const getCartData = async () => {
    dispatch(showLoader())
    if (activeVenue) {
      const orderVal = order ? '' : '-'
      let queryString = `?page=${itemOffset / itemsPerPage + 1}`
      if (orderby) {
        queryString += `&ordering=${orderVal}${orderby}`
      }
      // if (searchItem) {
      //   queryString += `&search=${searchItem}`
      // }
      const response = await GetCartData(queryString, activeVenue)
      dispatch(hideLoader())
      setCartData(response?.data?.data)
      const results = response?.data?.data?.items || []
      const count = response?.data?.data?.count || 0
      setTotalCount(count)
      setCurrentItems(results)
      setPageCount(Math.ceil(count / itemsPerPage))
      setTotalItemsOnPage(results.length)
      if (results?.length > 0) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }
    dispatch(hideLoader())
  }

  const handleIncrementCartItem = async (itemId, quantity, qty_of_case) => {
    if (quantity >= 0) {
      const data = {
        item: itemId,
        bar_venue: activeVenue,
        qty_of_unit: quantity + 1,
        qty_of_case: 0,
      }
      const response = await UpdateCartData(data)
      if (response?.status === 200) {
        getCartData()
        fetchData(activeVenue)
      }
    }
  }
  const handleDecrementCartItem = async (itemId, quantity, qty_of_case) => {
    if (quantity >= 0) {
      const data = {
        item: itemId,
        bar_venue: activeVenue,
        qty_of_unit: quantity - 1,
        qty_of_case: 0,
      }
      const response = await UpdateCartData(data)
      if (response?.status === 200) {
        getCartData()
        fetchData(activeVenue)
      }
    }
  }

  const handleIncrementCaseCartItem = async (itemId, caseSize, qty_of_unit) => {
    if (caseSize >= 0) {
      const data = {
        item: itemId,
        bar_venue: activeVenue,
        qty_of_case: caseSize + 1,
        qty_of_unit: 0,
      }
      const response = await UpdateCartData(data)
      if (response?.status === 200) {
        getCartData()
        fetchData(activeVenue)
      }
    }
  }
  const handleDecrementCaseCartItem = async (itemId, caseSize, qty_of_unit) => {
    const data = {
      item: itemId,
      bar_venue: activeVenue,
      qty_of_unit: 0,
      qty_of_case: caseSize - 1,
    }
    const response = await UpdateCartData(data)
    if (response?.status === 200) {
      getCartData()
      fetchData(activeVenue)
    }
  }

  const fetchData = async (activeVenue) => {
    dispatch(showLoader())

    try {
      const queryString = `?bar_vanue_id=${activeVenue}`
      const response = await GetGeneralData(queryString)
      if (response?.status === 200) {
        dispatch(setGeneral({ ...response?.data?.data }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedItem('')
  }
  const handleDeleteApiCall = async () => {
    dispatch(showLoader())
    const response = await DeleteYourcartItem(activeVenue, selectedItem)
    if (response?.status === 204) {
      deleteToastFun('Cart item deleted  successfully', 'success')
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getCartData()
      }
    } else {
      deleteToastFun('Something went wrong', 'error')
    }
    dispatch(hideLoader())
  }
  return (
    <WhiteCard className={'w-full mt-8'}>
      <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 items-center'>
        <div className='md:col-span-6 col-span-12'>
          <div className='flex items-center justify-start sm:flex-nowrap flex-wrap sm:gap-4 gap-3'>
            {/* <SearchFilter
              setSearchItem={setSearchItem}
              searchItem={searchItem}
              setItemOffset={setItemOffset}
              placeholder={'Search'}
              className={'sm:w-auto w-full'}
              iconRight
              sm
            /> */}
          </div>
        </div>
        <div className='xl:col-span-3 md:col-span-4 xl:col-end-13 md:col-end-13 col-span-12 text-end'>
          <Paragraph text16 className={'flex items-center md:justify-end font-semibold md:gap-5 gap-3'}>
            <span className='text-dark-grey'>Total Price</span>
            <span>
              {generalData?.currency ?? ''} {cartData?.total_cart_price?.toFixed(2) ?? 0}
            </span>
          </Paragraph>
        </div>

        <div className='col-span-12'>
          <TableLayout
            tableHeader={tableHeader}
            totalCount={totalCount}
            handleOptions={handleOptions}
            currentItems={currentItems}
            isEdit={false}
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
            deleteLabel={'Are you sure you want to delete this item from cart?'}
          />
        </Modal>
      )}
    </WhiteCard>
  )
}

export default YourCart
