import React, { useEffect, useState } from 'react'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import SelectType from '../../components/core/formComponents/SelectType'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import Button from '../../components/core/formComponents/Button'
import { FiPlus } from 'react-icons/fi'
import productImage from '../../assets/images/product_item_one.svg'
import TableLayout from '../../components/themeComponents/TableLayout'
import Modal from '../../components/core/Modal'
import AddNewReference from './AddNewReference'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/path'
import { useDispatch, useSelector } from 'react-redux'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { GetAllCategories } from '../../services/categoryService'
import { DeleteRecipeById, GetAllOwnerRecipe } from '../../services/recipeService'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { deleteToastFun } from '../../utils/commonHelper'
import AdminDeleteModal from '../../components/core/AdminDeleteModal'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function Recipes() {
  const itemsPerPage = 10
  const { generalData } = useSelector(generalDataSelector)
  const dispatch = useDispatch()
  const activeVenue = useSelector(activeVenueSelector)
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const navigate = useNavigate()
  const openPopup = (type) => {
    setPopupType(type)
    setPopUpOpen(true)
  }

  const handleItemClose = () => {
    setPopUpOpen(false)
    setPopUpOpen(false)
    navigate(paths?.owner?.items)
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
          setCategoriesListOption(formattedData)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getRecipeData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset, selectedCategory])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const tableHeader = [
    {
      key: 'Recipe name',
      value: 'recipe_name',
      sorting: true,
      sortkey: 'recipe_name',
      clickable: false,
    },
    {
      key: 'Sales price',
      value: 'sale_price',
      sorting: true,
      sortkey: 'sale_price',
      clickable: false,
      cell: ({ sale_price }) => {
        return <>{sale_price && <span>{`${generalData?.currency ?? ''} ${sale_price?.toFixed(2) ?? '--'}`}</span>}</>
      },
    },
    {
      key: 'Recipe Cost',
      value: 'total_cost',
      sorting: true,
      sortkey: 'total_cost',
      clickable: false,
      cell: ({ total_cost }) => {
        return <>{total_cost && <span>{`${generalData?.currency ?? ''} ${total_cost?.toFixed(2) ?? '--'}`}</span>}</>
      },
    },
    {
      key: 'Profit',
      value: 'sale_profit',
      sorting: true,
      sortkey: 'sale_profit',
      clickable: false,
      cell: ({ sale_profit }) => {
        return <>{sale_profit && <span>{`${generalData?.currency ?? ''} ${sale_profit?.toFixed(2) ?? '--'}`}</span>}</>
      },
    },
    {
      key: 'PLU code',
      value: 'PLU_code',
      sorting: true,
      sortkey: 'PLU_code',
      clickable: false,
    },
    // {
    //   key: 'Category',
    //   value: 'category.name',
    //   sorting: false,
    //   clickable: false,
    // },
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
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setSelectedItem('')
  }

  const handleOptions = (optionValue, item) => {
    switch (optionValue) {
      case UPDATE:
        setSelectedItem(item)
        navigate(`${paths?.owner?.editRecipe}/${item?.id}`)
        break
      case DELETE:
        setOpenDeleteModal(true)
        setSelectedItem(item?.id)
        break
      default:
        break
    }
  }

  const getRecipeData = async () => {
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

      const response = await GetAllOwnerRecipe(queryString, activeVenue)
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

  const handleDeleteApiCall = async () => {
    dispatch(showLoader())
    const response = await DeleteRecipeById(selectedItem)
    if (response?.status === 204) {
      deleteToastFun('Recipe deleted successfully', 'success')
      handleCloseDeleteModal()
      if (totalItemsOnPage === 1 && itemOffset > 0) {
        setItemOffset(itemOffset - itemsPerPage) // Go to the previous page
      } else {
        getRecipeData()
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
            {/* <SelectType
              sm
              options={categoriesListOption}
              placeholder={'Category'}
              onChange={(option) => setSelectedCategory(option?.value)}
              value={categoriesListOption?.find((option) => option?.value === selectedCategory) || ''}
            /> */}
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
            onClose={handleItemClose}
            header
            headingText={'Add New Reference'}
            width={'md:w-[700px]'}
          >
            <AddNewReference onClose={handleItemClose} selectedItem={selectedItem} />
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
            deleteLabel={'Are you sure you want to delete this recipe?'}
          />
        </Modal>
      )}
    </WhiteCard>
  )
}

export default Recipes
