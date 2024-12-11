import React, { useEffect, useState } from 'react'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import SelectType from '../../components/core/formComponents/SelectType'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import Button from '../../components/core/formComponents/Button'
import { FiPlus } from 'react-icons/fi'
import TableLayout from '../../components/themeComponents/TableLayout'
import Modal from '../../components/core/Modal'
import AddNewReference from './AddNewReference'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/path'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { DeleteOwnerItems, GetOwnerItems } from '../../services/itemsService'
import noImage from '../../assets/images/noImg.png'
import { deleteToastFun } from '../../utils/commonHelper'
import { GetAllCategories } from '../../services/categoryService'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function Items() {
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const itemsPerPage = 10
  const dispatch = useDispatch()
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [popUpOpen, setPopUpOpen] = useState(false)
  const [popupType, setPopupType] = useState('')
  const [currentItems, setCurrentItems] = useState([])
  const [totalItemsOnPage, setTotalItemsOnPage] = useState(0)
  const [selectedItem, setSelectedItem] = useState()
  const [searchItem, setSearchItem] = useState('')
  const [categoriesListOption, setCategoriesListOption] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()

  const navigate = useNavigate()
  const openPopup = (type) => {
    setPopupType(type)
    setPopUpOpen(true)
  }
  const closePopup = () => {
    setPopUpOpen(false)
    setPopupType('')
    setSelectedItem('')
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetAllCategories()
        if (response?.data?.status === 200) {
          const formattedData = response?.data?.data.map((category) => ({
            label: category.name,
            value: category.id,
          }))

          //to do from backend
          const asc_order = formattedData?.sort((a, b) => {
            if (a.label < b.label) return -1
            if (a.label > b.label) return 1
            return 0
          })

          setCategoriesListOption(asc_order)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getItemsData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset, selectedCategory])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem, selectedCategory])

  const tableHeader = [
    {
      key: 'Items name',
      value: 'item_name',
      sorting: true,
      sortkey: 'item_name',
      clickable: false,
      cell: ({ item_image, item_name, unit_size, unit_of_measure }) => {
        return (
          <div className='flex items-center gap-5'>
            <img src={item_image ? item_image : noImage} alt='product-img' className='w-10 h-10 flex-shrink-0' />
            <p>
              <span className='block'>{item_name ?? '--'}</span>

              {unit_size && (
                <span className='block text-xs text-dark-grey'>{`${unit_size ?? '-'} ${unit_of_measure?.name ?? '-'}`}</span>
              )}
            </p>
          </div>
        )
      },
    },
    {
      key: 'Sales price',
      value: 'actual_sell_price',
      sorting: true,
      sortkey: 'actual_sell_price',
      clickable: false,
      cell: ({ actual_sell_price }) => {
        return <>{actual_sell_price && <span>{`${generalData?.currency ?? ''} ${Number(actual_sell_price)?.toFixed(2) ?? '--'}`}</span>}</>
      },
    },
    {
      key: 'Cost price',
      value: 'actual_cost_price',
      sorting: true,
      sortkey: 'actual_cost_price',
      clickable: false,
      cell: ({ actual_cost_price }) => {
        return <>{actual_cost_price && <span>{`${generalData?.currency ?? ''} ${Number(actual_cost_price)?.toFixed(2) ?? '--'}`}</span>}</>
      },
    },
    { 
      key: 'Profit',
      value: 'actual_profit',
      sorting: true,
      sortkey: 'actual_profit',
      clickable: false,
      cell: ({ actual_profit }) => {
        return <>{actual_profit && <span>{`${generalData?.currency ?? ''} ${Number(actual_profit).toFixed(2) ?? '--'}`}</span>}</>
      },
    },
    {
      key: 'PLU code',
      value: 'PLU_code',
      sorting: true,
      sortkey: 'PLU_code',
      clickable: false,
    },
    {
      key: 'Category',
      value: 'category.name',
      sorting: true,
      sortkey: 'category_name',
      clickable: false,
    },
    {
      key: 'Actions',
      value: 'actions',
      sorting: false,
      clickable: false,
    },
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
        setSelectedItem(item)
        setPopUpOpen(true)
        setPopupType('reference')
        break
      case DELETE:
        setSelectedItem(item?.id)
        break
      default:
        break
    }
  }
  const getItemsData = async () => {
    dispatch(showLoader())
    if (activeVenue) {
      const orderVal = order ? '' : '-'
      let queryString = `?page=${itemOffset / itemsPerPage + 1}`
      if (orderby) {
        queryString += `&ordering=${orderVal}${orderby}`
      }
      if (selectedCategory) {
        queryString += `&category__id=${selectedCategory}`
      }
      if (searchItem) {
        queryString += `&search=${searchItem}`
      }

      const response = await GetOwnerItems(queryString, activeVenue)
      dispatch(hideLoader())
      const results = response?.data?.data?.results || []
      const count = response?.data?.data?.count || 0
      setTotalCount(count)
      setCurrentItems(results)
      setPageCount(Math.ceil(count / itemsPerPage))
      setTotalItemsOnPage(results.length)
    }
    dispatch(hideLoader())
  }
  const handleDeleteApiCall = async (item) => {
    dispatch(showLoader())
    const response = await DeleteOwnerItems(item?.id)
    if (response?.status === 204) {
      deleteToastFun('Item deleted  successfully', 'success')
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getItemsData()
      }
    } else {
      deleteToastFun('Something went wrong', 'error')
    }
    dispatch(hideLoader())
  }

  return (
    <WhiteCard>
      <div className='grid grid-cols-12 gap-4'>
        <div className='lg:col-span-4 col-span-12 order-2 sm:order-1'>
          <div className='flex items-center justify-start xl:flex-nowrap lg:flex-wrap sm:flex-nowrap flex-wrap sm:gap-4 gap-3'>
            <SearchFilter
              setSearchItem={setSearchItem}
              searchItem={searchItem}
              setItemOffset={setItemOffset}
              placeholder={'Search'}
              className={'sm:w-auto w-full'}
              iconRight
              sm
            />
            <SelectType
              sm
              options={categoriesListOption}
              placeholder={'Category'}
              onChange={(option) => setSelectedCategory(option?.value)}
              value={categoriesListOption?.find((option) => option?.value === selectedCategory) || ''}
            />
            {selectedCategory && (
              <div className='flex items-center justify-end gap-4'>
                <Button
                  onClick={() => {
                    setSelectedCategory(null)
                  }}
                  secondary
                  className={'w-full md:w-auto'}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className='lg:col-span-8 col-span-12 order-1 sm:order-2'>
          <div className='flex items-center justify-end xl:flex-nowrap md:flex-wrap sm:flex-nowrap flex-wrap gap-4'>
            <Button primary onClick={() => openPopup('reference')} className={'w-full sm:w-auto'}>
              <FiPlus fontSize={'18px'} />
              Add new reference
            </Button>
            <Button primary className={'w-full sm:w-auto'} onClick={() => navigate(paths.owner.addRecipe)}>
              <FiPlus fontSize={'18px'} />
              Add recipe
            </Button>
          </div>
        </div>
        {popupType === 'reference' && (
          <Modal
            open={popUpOpen}
            onClose={closePopup}
            header
            headingText={selectedItem?.id ? 'Edit Item' : 'Add New Reference'}
            width={'md:w-[700px]'}
          >
            <AddNewReference onClose={closePopup} selectedItem={selectedItem} getItemsData={getItemsData} />
          </Modal>
        )}
        <div className='col-span-12 order-3'>
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
            handleDeleteApiCall={handleDeleteApiCall}
          />
        </div>
      </div>
    </WhiteCard>
  )
}

export default Items
