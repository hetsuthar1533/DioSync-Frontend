/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Paragraph from '../../components/core/typography/Paragraph'
import ThemeDatePicker from '../../components/core/formComponents/ThemeDatePicker'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import SelectType from '../../components/core/formComponents/SelectType'
import TableLayout from '../../components/themeComponents/TableLayout'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { GetAllHistoryType, GetHistoryInventory } from '../../services/historyService'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import Button from '../../components/core/formComponents/Button'
import moment from 'moment'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function HistoryInventory() {
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
  const [historyTypeOptions, setHistoryTypeOptions] = useState([])
  const [selectedHistoryType, setSelectedHistoryType] = useState(null)

  useEffect(() => {
    if (activeVenue) {
      getAllHistoryTypes()
    }
  }, [activeVenue])

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (activeVenue) {
        getHistoryInventoryData(activeVenue)
      }
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchItem,
    orderby,
    order,
    itemOffset,
    activeVenueSelector,
    activeVenue,
    startDate && endDate,
    selectedHistoryType,
  ])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getAllHistoryTypes = async () => {
    try {
      const response = await GetAllHistoryType()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((type) => ({
          label: type.type_name,
          value: type.id,
        }))
        setHistoryTypeOptions(formattedData)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const getHistoryInventoryData = async (activeVenue) => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (selectedHistoryType !== null && selectedHistoryType !== undefined) {
      queryString += `&history_type=${selectedHistoryType}`
    }
    if (startDate && endDate) {
      queryString += `&start_date=${moment(startDate).format('YYYY-MM-DD')}&end_date=${moment(endDate).format('YYYY-MM-DD')}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    const response = await GetHistoryInventory(activeVenue, queryString)
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    setTotalCount(count)

    dispatch(hideLoader())
  }

  const tableHeader = [
    {
      key: 'Type',
      value: 'history_type.type_name',
      sorting: false,
      sortkey: 'history_type__type_name',
      clickable: false,
    },
    {
      key: 'Employee name',
      value: 'employee_name.full_name',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Date',
      value: 'created_at',
      sorting: false,
      clickable: false,
      cell: ({ created_at }) => {
        return <>{created_at && <span>{moment.utc(created_at).local().format('h:mm A DD.MM.YYYY')}</span>}</>
      },
    },
    {
      key: 'Value',
      value: 'value',
      sorting: false,
      clickable: false,
      cell: ({ value }) => {
        return <>{value ? `${generalData?.currency ?? ''} ${value}` : '--'}</>
      },
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
        <div className='xl:col-span-6 col-span-12 xl:order-1 order-2'>
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
              options={historyTypeOptions}
              placeholder={'Select'}
              onChange={(option) => setSelectedHistoryType(option?.value)}
              value={historyTypeOptions?.find((option) => option?.value === selectedHistoryType) || ''}
            />
            {selectedHistoryType && (
              <div className='flex items-center justify-end gap-4'>
                <Button
                  onClick={() => {
                    setSelectedHistoryType(null)
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
        <div className='xl:col-span-6 col-span-12 xl:order-2 order-1'>
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
            isBulkActive={false}
          />
        </div>
      </div>
    </WhiteCard>
  )
}

export default HistoryInventory
