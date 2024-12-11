import React, { useEffect, useState } from 'react'
import SearchFilter from '../../../components/core/formComponents/SearchFilter'
import WhiteCard from '../../../components/themeComponents/WhiteCard'
import TableLayout from '../../../components/themeComponents/TableLayout'
import { GetCSVReports, GetCSVReportsUsingFilter, GetReports } from '../../../services/reportsService'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'
import Button from '../../../components/core/formComponents/Button'
import Paragraph from '../../../components/core/typography/Paragraph'
import ThemeDatePicker from '../../../components/core/formComponents/ThemeDatePicker'
import moment from 'moment/moment'
import { generalDataSelector } from '../../../redux/slices/generalDataSlice'

function BarOwnerReports() {
  const { generalData } = useSelector(generalDataSelector)
  const tableHeader = [
    {
      key: 'Bar owner name',
      value: 'bar_owner_name',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Bar owner email',
      value: 'bar_owner_email',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Venue',
      value: 'bar_name',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Subscription plan name',
      value: 'subscription_plan_name',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Subscription plan validity',
      value: 'subscription_plan_validity',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Subscription price',
      value: 'subscription_price',
      sorting: false,
      clickable: false,
      cell: ({ subscription_price }) => {
        return subscription_price ? <>{`${generalData?.currency ?? ''} ${subscription_price}`}</>:"--"
      },
    },
    {
      key: 'Joining date',
      value: 'joining_date',
      sorting: false,
      clickable: false,
      cell: ({ joining_date }) => {
        return <>{moment.utc(new Date(joining_date)).format('YYYY-MM-DD')}</>
      },
    },
    {
      key: 'Expiry Date',
      value: 'expiring_date',
      sorting: false,
      clickable: false,
      cell: ({ expiring_date }) => {
        return <>{moment.utc(new Date(expiring_date)).format('YYYY-MM-DD')}</>
      },
    },
  ]
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [searchItem, setSearchItem] = useState('')

  useEffect(() => {
    const debounce = setTimeout(() => {
      getReportsData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getReportsData = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    const response = await GetReports(queryString)
    dispatch(hideLoader())
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
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
  const handleExportCSV = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    const response = await GetCSVReports(queryString)
    if (response?.status === 200) {
      const csvData = response?.data
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const donwloadCSV = document.createElement('a')
      donwloadCSV.setAttribute('href', url)
      donwloadCSV.setAttribute('download', `Bar_Owner_Report_${moment().format('l')}_${moment().valueOf()}.csv`)
      document.body.appendChild(donwloadCSV)
      donwloadCSV.click()
      document.body.removeChild(donwloadCSV)
    }
    dispatch(hideLoader())
  }
  const getCSVReportsUsingFilter = async () => {
    dispatch(showLoader())
    let queryString = `?page=${itemOffset / itemsPerPage + 1}&start_date=${moment(startDate).format('YYYY-MM-DD')}&end_date=${moment(endDate).format('YYYY-MM-DD')}`
    const response = await GetCSVReportsUsingFilter(queryString)
    dispatch(hideLoader())
    const results = response?.data?.data || []
    const count = response?.data?.data?.count || 0
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    dispatch(hideLoader())
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
            <Button primary onClick={handleExportCSV}>
              Export CSV
            </Button>{' '}
          </div>
        </div>
        <div className='xl:col-span-6 col-span-12 xl:order-2 order-1'>
          <div className='flex items-center xl:justify-end justify-start md:gap-4 gap-3 md:order-1 order-2'>
            <div className='flex items-center gap-[10px]'>
              <Paragraph text14>From</Paragraph>
              <ThemeDatePicker
                placeholder='Select date'
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat={'dd-MM-yyyy'}
                className='bg-light-grey border-0 !py-2'
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
                className='bg-light-grey border-0 !py-2'
              ></ThemeDatePicker>
            </div>
            <div className='flex items-center justify-end gap-4'>
              {startDate && endDate && (
                <Button
                  onClick={() => {
                    setStartDate(null)
                    setEndDate(null)
                    getReportsData()
                  }}
                  secondary
                  className={'w-full md:w-auto'}
                >
                  Clear
                </Button>
              )}
              <Button
                type='submit'
                primary
                className={'w-full md:w-auto'}
                onClick={getCSVReportsUsingFilter}
                disabled={!startDate || !endDate}
              >
                Filter
              </Button>
            </div>
          </div>
        </div>
        <div className='col-span-12 order-3'>
          <TableLayout
            tableHeader={tableHeader}
            totalCount={totalCount}
            currentItems={currentItems}
            isEdit={false}
            isDelete={false}
            isView={false}
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

export default BarOwnerReports
