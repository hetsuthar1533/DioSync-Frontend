import React, { useState, useEffect } from 'react'
import Paragraph from '../../components/core/typography/Paragraph'
import ThemeDatePicker from '../../components/core/formComponents/ThemeDatePicker'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import TableLayout from '../../components/themeComponents/TableLayout'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import { DELETE, UPDATE, VIEW } from '../../constants/roleConstants'
import { useDispatch, useSelector } from 'react-redux'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import moment from 'moment'
import { GetAllHistoryOrders } from '../../services/historyService'
import Button from '../../components/core/formComponents/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from '../../routes/path'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function HistoryOrders() {
  const navigate = useNavigate()
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const dispatch = useDispatch()
  const itemsPerPage = 10
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [searchItem, setSearchItem] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (activeVenue) {
        getHistoryOrdersData(activeVenue)
      }
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset, activeVenueSelector, activeVenue, startDate && endDate])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getHistoryOrdersData = async (activeVenue) => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (startDate && endDate) {
      queryString += `&start_date=${moment(startDate).format('YYYY-MM-DD')}&end_date=${moment(endDate).format('YYYY-MM-DD')}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    const response = await GetAllHistoryOrders(activeVenue, queryString)
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    setTotalCount(count)
    dispatch(hideLoader())
  }

  const tableHeader = [
    {
      key: 'Order date',
      value: 'order_date',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Employee name',
      value: 'created_by.full_name',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Value',
      value: 'total_order_amount',
      sorting: false,
      clickable: false,
      cell: ({ total_order_amount }) => {
        return (
          <>{total_order_amount ? `${generalData?.currency ?? ''} ${Number(total_order_amount)?.toFixed(2)}` : '--'}</>
        )
      },
    },
    {
      key: 'Suppliers',
      value: 'supplier.supplier_name',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Order status',
      value: 'status.status_name',
      sorting: false,
      clickable: false,
      cell: ({ status }) => {
        return (
          <>
            <span
              className={`${status?.status_name === 'DELIVERED' ? 'bg-site-green/10 text-site-green' : 'bg-[#FF00001A]/10 text-site-red'} text-nowrap rounded-lg py-[6px] px-3 text-sm leading-[21px] font-semibold`}
            >
              {status?.status_name}
            </span>
          </>
        )
      },
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
      case VIEW:
        navigate(`${paths?.owner?.orderDetail}/${item?.unique_order_id}/${item?.supplier?.id}`)
        break
      case DELETE:
        break
      default:
        break
    }
  }

  return (
    <WhiteCard>
      <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 '>
        <div className='lg:col-span-6 col-span-12 lg:order-1 order-2'>
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
          </div>
        </div>
        <div className='lg:col-span-6 col-span-12 lg:order-2 order-1'>
          <div className='flex items-center xl:justify-end justify-start md:gap-8 gap-3 md:order-1 order-2'>
            <div className='flex items-center gap-[10px]'>
              <Paragraph text14>From</Paragraph>
              <ThemeDatePicker
                placeholder='Select date'
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat={'dd-MM-yyyy'}
                className='bg-light-grey border-0 !py-2'
                maxDate={new Date()}
              ></ThemeDatePicker>
            </div>
            <div className='flex items-center gap-[10px]'>
              <Paragraph text14>To</Paragraph>
              <ThemeDatePicker
                placeholder='Select date'
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat={'dd-MM-yyyy'}
                minDate={startDate} // Disable dates before startDate
                maxDate={new Date()} // Disable future dates
                className='bg-light-grey border-0 !py-2'
              ></ThemeDatePicker>
            </div>
            <div className='flex items-center justify-end gap-4'>
              {startDate && endDate && (
                <Button
                  onClick={() => {
                    setStartDate(null)
                    setEndDate(null)
                  }}
                  secondary
                  className={'w-full md:w-auto'}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className='col-span-12 order-3'>
          <TableLayout
            totalCount={totalCount}
            tableHeader={tableHeader}
            handleOptions={handleOptions}
            currentItems={currentItems}
            isEdit={false}
            isDelete={false}
            isView={true}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            itemOffset={itemOffset}
            itemsPerPage={itemsPerPage}
            handleSorting={handleSorting}
          />
        </div>
      </div>
    </WhiteCard>
  )
}

export default HistoryOrders
