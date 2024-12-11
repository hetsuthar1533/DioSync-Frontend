/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import Paragraph from '../../components/core/typography/Paragraph'
import { ReactComponent as StockValue } from '../../assets/images/icon_stock_val.svg'
import { ReactComponent as BrokenBottle } from '../../assets/images/icon_broken_bottle.svg'
import ThemeDatePicker from '../../components/core/formComponents/ThemeDatePicker'
import DashboardStatCard from '../../components/themeComponents/DashboardStatCard'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import ListItem from '../../components/themeComponents/ListItem'
import productImage from '../../assets/images/product_item_one.svg'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import SelectType from '../../components/core/formComponents/SelectType'
import TableLayout from '../../components/themeComponents/TableLayout'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import moment from 'moment'
import {
  GetAllPageStocksItems,
  GetStocksByUnits,
  GetStocksByValue,
  GetStocksSlowMovingItems,
  GetStocksStastics,
  GetStockTrustIndicator,
} from '../../services/stocksService'
import { GetTrustIndicator } from '../../services/commonService'
import Button from '../../components/core/formComponents/Button'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import noImage from '../../assets/images/noImg.png'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import { beautifyNumber } from '../../utils/commonHelper'

function Stock() {
  const dispatch = useDispatch()
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const [trustIndicatorData, setTrustIndicatorData] = useState(0)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [staisticsData, setStatisticsData] = useState({})

  const [slowMovingData, setSlowMovingData] = useState([])
  const [topStockedByValueData, setTopStockedByValueData] = useState([])
  const [topStockedByUnitData, setTopStockedByUnitData] = useState([])

  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(false)
  const [searchItem, setSearchItem] = useState('')

  useEffect(() => {
    if (activeVenue) {
      getTrustIndicator(activeVenue)
    }
  }, [activeVenue])

  useEffect(() => {
    document.title = `Stocks - DioSync`
  }, [])

  useEffect(() => {
    if (activeVenue) {
      getStockStatistics(activeVenue)
      getSlowMovingItems(activeVenue)
      getTopStockedItemsByValue(activeVenue)
      getTopStockedItemsByUnit(activeVenue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate && endDate, activeVenue])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getStockList(activeVenue)
    }, 300)

    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate && endDate, activeVenue, searchItem, orderby, order, itemOffset])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

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

  const getTrustIndicator = async (activeVenue) => {
    dispatch(showLoader())
    const queryString = `?bar_vanue_id=${activeVenue}`
    const response = await GetTrustIndicator(queryString)
    if (response?.status === 200) {
      setTrustIndicatorData(response?.data?.data?.trust_indicator)
    }
    dispatch(hideLoader())
  }

  const getStockStatistics = async (activeVenue) => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    const response = await GetStocksStastics(queryString)
    if (response?.status === 200) {
      setStatisticsData(response?.data?.data)
    }
    dispatch(hideLoader())
  }

  const getSlowMovingItems = async (activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader())
    const response = await GetStocksSlowMovingItems(queryString)
    if (response?.status === 200) {
      setSlowMovingData(response?.data?.data?.results)
    }
    dispatch(hideLoader())
  }

  const getTopStockedItemsByValue = async (activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader())
    const response = await GetStocksByValue(queryString)
    if (response?.status === 200) {
      setTopStockedByValueData(response?.data?.data?.results)
    }
    dispatch(hideLoader())
  }
  const getTopStockedItemsByUnit = async (activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader())
    const response = await GetStocksByUnits(queryString)
    if (response?.status === 200) {
      setTopStockedByUnitData(response?.data?.data?.results)
    }
    dispatch(hideLoader())
  }

  const getStockList = async (activeVenue) => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?bar_vanue_id=${activeVenue}&page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    const response = await GetAllPageStocksItems(queryString)
    dispatch(hideLoader())
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    dispatch(hideLoader())
  }

  const trustIndicator = {
    options: {
      chart: {
        id: 'stockTrustIndicator',
        // height: '150',
        type: 'radialBar',
      },
      colors: ['#00A511'],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '30%',
          },
          dataLabels: {
            id: 'test',
            showOn: 'always',
            name: {
              show: false, // Hide the label
            },
            value: {
              color: '#00A511',
              fontSize: '10px',
              show: true,
              offsetY: 4,
            },
          },
          track: {
            background: 'rgba(0, 165, 17, .1)', // Set the background color of the track (the outer circle)
            strokeWidth: '100%',
          },
        },
      },
      stroke: {
        lineCap: 'round',
        fill: '#00A511',
      },
    },
    series: [trustIndicatorData ?? 0],
  }

  const tableHeader = [
    {
      key: 'Items name',
      value: 'item_name',
      sorting: true,
      sortkey: 'item_name',
      cell: ({ item_image, item_name, description }) => {
        return (
          <div className='flex items-center gap-5'>
            <img src={item_image ? item_image : noImage} alt='product-img' className='w-10 h-10 flex-shrink-0' />
            <p>
              <span className='block'>{item_name ?? '--'}</span>

              {description && <span className='block text-xs text-dark-grey'>{`${description} `}</span>}
            </p>
          </div>
        )
      },
    },
    {
      key: 'Quantity',
      value: 'total_quantity',
      sorting: true,
      sortkey: 'total_quantity',
      clickable: false,
      cell: ({ total_quantity }) => {
        return <>{beautifyNumber(total_quantity)}</>
      },
    },
    {
      key: 'Cost value',
      value: 'cost_value',
      sorting: true,
      sortkey: 'cost_value',
      clickable: false,
      cell: ({ cost_value }) => {
        return (
          <>{cost_value && <span>{`${generalData?.currency ?? ''} ${beautifyNumber(cost_value) ?? '--'}`}</span>}</>
        )
      },
    },
    {
      key: 'Stock value',
      value: 'stock_value',
      sorting: true,
      sortkey: 'stock_value',
      clickable: false,
      cell: ({ stock_value }) => {
        return (
          <>{stock_value && <span>{`${generalData?.currency ?? ''} ${beautifyNumber(stock_value) ?? '--'}`}</span>}</>
        )
      },
    },
    {
      key: 'Avg. storage life',
      value: 'avg_storage_life',
      sorting: true,
      sortkey: 'avg_storage_life',
      clickable: false,
      cell: ({ avg_storage_life }) => {
        return <>{beautifyNumber(avg_storage_life)}</>
      },
    },
    {
      key: 'Breakage & loss ',
      value: 'breakage_and_loss',
      sorting: true,
      sortkey: 'breakage_and_loss',
      clickable: false,
      cell: ({ breakage_and_loss }) => {
        return <>{beautifyNumber(breakage_and_loss)}</>
      },
    },
  ]

  return (
    <div>
      <div className='flex items-center justify-between lg:flex-nowrap flex-wrap gap-3 lg:mt-0 -mt-5'>
        <div className='flex items-center md:gap-8 gap-3'>
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
          {startDate && endDate && (
            <div className='flex items-center justify-end gap-4'>
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
            </div>
          )}
        </div>
        <div className='flex items-center lg:-mt-4 lg:-ms-5 -ms-4'>
          <Chart
            options={trustIndicator.options}
            series={trustIndicator.series}
            type='radialBar'
            width={'120px'}
            // height={trustIndicator.options.chart.height}
            height={'120px'}
          />
          <Paragraph text12 className={'font-semibold'}>
            Trust Indicator
          </Paragraph>
        </div>
      </div>
      <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3 mt-6'>
        <div className='xl:col-span-8 md:col-span-6 col-span-12'>
          <div className='grid xl:grid-cols-2 grid-cols-1 lg:gap-6 sm:gap-4 gap-3'>
            <div className='col-span-1'>
              <DashboardStatCard
                className={'bg-primary-blue/5'}
                icon={<StockValue />}
                isUp={staisticsData?.stock_value?.is_up}
                value={`${staisticsData?.stock_value?.count ?? 0}%`}
                statValue={`${generalData?.currency ?? ''} ${staisticsData?.stock_value?.value ?? 0}`}
                statName={'Stock Value'}
                tooltip={'Total stock value from last full inventory'}
              />
            </div>
            <div className='col-span-1'>
              <DashboardStatCard
                className={'bg-site-yellow/5'}
                icon={<BrokenBottle />}
                isUp={staisticsData?.breakage_and_loss?.is_up}
                value={`${staisticsData?.breakage_and_loss?.count ?? 0}%`}
                statValueLabel={'Value'}
                statValue={`${generalData?.currency ?? ''}  ${staisticsData?.breakage_and_loss?.value ?? 0}`}
                statName={'Breakage & loss'}
                unitLabel={'Unit'}
                unitValue={staisticsData?.breakage_and_loss?.unit ?? 0}
                tooltip={'Value and units of breakages and losses since last full inventory'}
              />
            </div>
            <div className='col-span-1'>
              <WhiteCard p20>
                <Paragraph text20 className={'mb-4'}>
                  Slow moving items
                </Paragraph>
                {slowMovingData?.length > 0 ? (
                  slowMovingData?.slice(0, 3)?.map((item, index) => {
                    return (
                      <ListItem
                        key={item?.id}
                        withBorder
                        withCount
                        count={index + 1}
                        positive={item?.side_data?.is_up}
                        negative={!item?.side_data?.is_up}
                        neutral={false}
                        className='mb-1'
                        itemName={item?.item_name}
                        productImage={item?.item_image}
                        pillValue={item?.side_data?.count}
                      />
                    )
                  })
                ) : (
                  <div className='flex flex-col  justify-center w-full py-4'>
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                )}
              </WhiteCard>
            </div>
            <div className='col-span-1'>
              <WhiteCard p20>
                <Paragraph text20 className={'mb-4'}>
                  Top stocked items by value
                </Paragraph>
                {topStockedByValueData?.length > 0 ? (
                  topStockedByValueData?.slice(0, 3)?.map((item, index) => {
                    return (
                      <ListItem
                        key={item?.id}
                        withBorder
                        withCount
                        count={index + 1}
                        positive={false}
                        negative={false}
                        neutral={true}
                        className='mb-1'
                        itemName={item?.item_name}
                        productImage={item?.item_image}
                        pillValue={item?.stock_value}
                      />
                    )
                  })
                ) : (
                  <div className='flex flex-col  justify-center w-full py-4'>
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                )}
              </WhiteCard>
            </div>
          </div>
        </div>
        <div className='xl:col-span-4 md:col-span-6 col-span-12'>
          <WhiteCard p20>
            <Paragraph text20 className={'mb-5'}>
              Top stocked items by unit
            </Paragraph>
            {topStockedByUnitData?.length > 0 ? (
              topStockedByUnitData?.slice(0, 6)?.map((item, index) => {
                return (
                  <ListItem
                    key={item?.id}
                    withBorder
                    withCount
                    count={index + 1}
                    positive={item?.side_data?.is_up}
                    negative={!item?.side_data?.is_up}
                    pillValue={item?.side_data?.count}
                    neutral={false}
                    className='mb-1'
                    itemName={item?.item_name}
                    productImage={item?.item_image ?? noImage}
                  />
                )
              })
            ) : (
              <div className='flex flex-col  justify-center w-full py-4'>
                <Paragraph text16 className={'font-semibold'}>
                  Data not found..!!
                </Paragraph>
              </div>
            )}
          </WhiteCard>
        </div>
        <div className='col-span-12'>
          <WhiteCard>
            <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 items-center'>
              <div className='md:col-span-3 col-span-12'>
                <Paragraph text20 className={''}>
                  Stock list
                </Paragraph>
              </div>
              <div className='md:col-span-6 md:col-end-13 col-span-12'>
                <div className='flex items-center md:justify-end justify-start sm:flex-nowrap flex-wrap sm:gap-4 gap-3'>
                  <SearchFilter
                    setSearchItem={setSearchItem}
                    searchItem={searchItem}
                    placeholder={'Search'}
                    className={'sm:w-auto w-full'}
                    iconRight
                    sm
                  />
                </div>
              </div>
              <div className='col-span-12'>
                <TableLayout
                  tableHeader={tableHeader}
                  totalCount={totalCount}
                  currentItems={currentItems}
                  isEdit={false}
                  isDelete={false}
                  isView={false}
                  handleSorting={handleSorting}
                  pageCount={pageCount}
                  itemOffset={itemOffset}
                  itemsPerPage={itemsPerPage}
                  handlePageClick={handlePageClick}
                  isBulkActive={false}
                />
              </div>
            </div>
          </WhiteCard>
        </div>
      </div>
    </div>
  )
}

export default Stock
