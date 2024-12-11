import React, { useEffect, useState } from 'react'
import TableLayout from '../../components/themeComponents/TableLayout'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import SelectType from '../../components/core/formComponents/SelectType'
import { DELETE, UPDATE, userRoles } from '../../constants/roleConstants'
import productImage from '../../assets/images/product_item_one.svg'
import Button from '../../components/core/formComponents/Button'
import { FiPlus } from 'react-icons/fi'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/path'
import noImage from '../../assets/images/noImg.png'
import { GetAllCategories } from '../../services/categoryService'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { GetOwnerItems } from '../../services/itemsService'
import { AddToCart } from '../../services/inventoryService'
import { userTypeSelector } from '../../redux/slices/userSlice'
import { generalDataSelector, setGeneral } from '../../redux/slices/generalDataSlice'
import { GetGeneralData } from '../../services/commonService'

function CartBuilder() {
  const { generalData } = useSelector(generalDataSelector)
  const userType = useSelector(userTypeSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const itemsPerPage = 10
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [currentItems, setCurrentItems] = useState([])

  const [searchItem, setSearchItem] = useState('')
  const [categoriesListOption, setCategoriesListOption] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()

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
    }
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
      key: 'Cost value',
      value: 'cost_price',
      sorting: false,
      clickable: false,
      cell: ({ cost_price }) => {
        return <>{cost_price && <span>{`${generalData?.currency ?? ''} ${cost_price?.toFixed(2) ?? '--'}`}</span>}</>
      },
    },
    // {
    //   key: 'Real time stock',
    //   value: 'real_time_stock',
    //   sorting: false,
    //   clickable: false,
    // },
    {
      key: 'Restocking threshold ',
      value: 'restock_threshold',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Suppliers ',
      value: 'suppliers',
      sorting: false,
      clickable: false,
      cell: ({ vendor }) => {
        return <>{vendor?.supplier_name}</>
      },
    },
    { key: 'Cart', value: 'cart', sorting: false, clickable: true },
  ]

  const handleOptions = (optionValue, item) => {
    switch (optionValue) {
      case UPDATE:
        break
      case DELETE:
        break
      default:
        break
    }
  }

  const handleAddtoCart = async (data, type) => {
    if (activeVenue > 0 && data?.selectedItem && data?.cartQuantity > 0) {
      if (type === 'full_unit')
        await AddToCart(
          {
            bar_venue: activeVenue,
            item: data?.selectedItem,
            qty_of_unit: data?.cartQuantity,
            qty_of_case: 0,
          },
          activeVenue,
        )
      else {
        await AddToCart(
          {
            bar_venue: activeVenue,
            item: data?.selectedItem,
            qty_of_case: data?.cartQuantity,
            qty_of_unit: 0,
          },
          activeVenue,
        )
      }
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

  return (
    <>
      <WhiteCard className={'w-full mt-8'}>
        <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 items-center'>
          <div className='md:col-span-6 col-span-12'>
            <div className='flex items-center justify-start sm:flex-nowrap flex-wrap sm:gap-4 gap-3'>
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
          <div className='xl:col-span-3 md:col-span-4 xl:col-end-13 md:col-end-13  col-span-12 text-end'>
            <Button
              primary
              className={'w-full md:w-auto'}
              onClick={() =>
                userType === userRoles?.Owner ? navigate(paths?.owner?.items) : navigate(paths?.manager?.items)
              }
            >
              <FiPlus fontSize={'18px'} />
              Add new reference
            </Button>
          </div>

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
              handleAddtoCart={handleAddtoCart}
            />
          </div>
        </div>
      </WhiteCard>
    </>
  )
}

export default CartBuilder
