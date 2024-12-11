/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Paragraph from '../../components/core/typography/Paragraph'
import ThemeDatePicker from '../../components/core/formComponents/ThemeDatePicker'
import Button from '../../components/core/formComponents/Button'
import DashboardStatCard from '../../components/themeComponents/DashboardStatCard'
import { ReactComponent as StockValue } from '../../assets/images/icon_stock_val.svg'
import { ReactComponent as IconProfitability } from '../../assets/images/icon_profitability.svg'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import Chart from 'react-apexcharts'
import SelectType from '../../components/core/formComponents/SelectType'
import ListItem from '../../components/themeComponents/ListItem'
import TableLayout from '../../components/themeComponents/TableLayout'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import NotificationItem from '../../components/themeComponents/NotificationItem'
import {
  GetVarinaceAlertUpdates,
  GetVarinaceGraph,
  GetVarinaceInAmount,
  GetVarinaceInCl,
  GetVarinacePageData,
  GetVarinaceStastics,
} from '../../services/varinaceService'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import noImage from '../../assets/images/noImg.png'
import InfiniteScroll from 'react-infinite-scroll-component'
import { beautifyNumber, handleAlertUpdateIconType } from '../../utils/commonHelper'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { chartOptions } from '../../constants/commonConstants'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function Variances() {
  const { generalData } = useSelector(generalDataSelector)
  const dispatch = useDispatch()
  const activeVenue = useSelector(activeVenueSelector)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  //for filter
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  // for statistics
  const [staisticsData, setStatisticsData] = useState({})
  const [selectedChartOption, setSelectedChartOption] = useState(2)
  //chart UseStates
  const [xAxisData, setXAxisData] = useState([''])
  const [chartValueSeries, setChartValueSeries] = useState([0])
  const [maxSeries, setMaxSeries] = useState(0)
  //Alert and Updates
  const [alertUpdateData, setAlertUpdateData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [alertUpdatePage, setAlertUpdatePage] = useState(1) // Track current page
  const [loading, setLoading] = useState(false)
  const alertItemsPerPage = 10

  // Varinace side top data useState
  const [varianceInAmountData, setVarianceInAmountData] = useState([])
  const [varianceInClData, setVarianceInClData] = useState([])

  //variacnce table data
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(false)
  const [searchItem, setSearchItem] = useState('')

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage
    setItemOffset(newOffset)
  }

  const handleSorting = (data, order) => {
    setOrderby(data)
    setOrder(order)
  }

  useEffect(() => {
    getVarianceStatistics()
    getVarianceInAmount()
    getVarianceInCL()
  }, [startDate && endDate, activeVenue])

  useEffect(() => {
    getVarianceChart(activeVenue, selectedChartOption)
  }, [startDate && endDate, activeVenue, selectedChartOption])

  useEffect(() => {
    getAlertUpdateData()
  }, [startDate && endDate, activeVenue, alertUpdatePage])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getVarianeAllData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
  }, [searchItem, orderby, order, itemOffset, startDate && endDate, activeVenue])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getVarianceStatistics = async () => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    const response = await GetVarinaceStastics(queryString)
    if (response?.status === 200) {
      setStatisticsData(response?.data?.data)
    }
    dispatch(hideLoader())
  }
  const getAlertUpdateData = async () => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${alertUpdatePage}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader()) // Show loader before API call
    setLoading(true)
    try {
      const response = await GetVarinaceAlertUpdates(queryString)
      const count = response?.data?.data?.count || 0
      if (response?.data?.data?.results) {
        setAlertUpdateData((prevData) => [...prevData, ...response?.data?.data?.results])

        // Stop loading more if we reach the end
        setHasMore(alertUpdatePage < Math.ceil(count / alertItemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoading(false)
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

  const getVarianceChart = async (activeVenue, selectedChartOption) => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    if (selectedChartOption) {
      queryString += `&filter=${selectedChartOption}`
    }
    const response = await GetVarinaceGraph(queryString)
    if (response?.status === 200) {
      const arrDateAxis = response?.data?.data?.map((object) => object?.name) || []
      const series = response?.data?.data?.map((object) => object?.value) || []
      const maxofSeries = Math.max(...series)
      setMaxSeries(maxofSeries)
      setXAxisData(arrDateAxis)
      setChartValueSeries(series)
    }
    dispatch(hideLoader())
  }
  const getVarianceInAmount = async () => {
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader())
    const response = await GetVarinaceInAmount(queryString)
    if (response?.status === 200) {
      setVarianceInAmountData(response?.data?.data?.results)
    }
    dispatch(hideLoader())
  }
  const getVarianceInCL = async () => {
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader())
    const response = await GetVarinaceInCl(queryString)
    if (response?.status === 200) {
      setVarianceInClData(response?.data?.data?.results)
    }
    dispatch(hideLoader())
  }

  const getVarianeAllData = async () => {
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
    const response = await GetVarinacePageData(queryString)
    dispatch(hideLoader())
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    dispatch(hideLoader())
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const salesOverview = {
    options: {
      chart: {
        id: 'salesOverview',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      colors: ['#083ED1'],
      xaxis: {
        categories: xAxisData,
        labels: {
          style: {
            colors: '#919297',
            fontSize: '14px',
            fontWeight: 600,
          },
        },
      },
      yaxis: {
        min: 0,
        max: Math.ceil(maxSeries / 5000) * 5000 > 25000 ? Math.ceil(maxSeries / 5000) * 5000 : 25000,
        step: 7,
        labels: {
          style: {
            colors: '#919297',
            fontSize: '14px',
            fontWeight: 600,
          },
          formatter: function (value) {
            return `${generalData?.currency ?? ''} ` + value.toLocaleString()
          },
        },
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px',
          color: '#fff',
          // backgroundColor: '#080808',
          backgroundColor: 'transparent',
        },
        onDatasetHover: {
          highlightDataSeries: false,
        },
        x: {
          show: true,
          formatter: function (value, { dataPointIndex, w }) {
            const categories = w.globals.categoryLabels
            const category = categories[dataPointIndex]
            return (
              '<span style="font-weight: 600; font-size:14px; line-height:14px; color: #080808;">' +
              category +
              '</span>'
            )
          },
        },
        y: {
          formatter: undefined,
          title: {
            formatter: (seriesName) => 'Total ',
          },
        },
        marker: {
          show: false,
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          var data = series[seriesIndex][dataPointIndex]
          return (
            '<div style="background: #333; padding: 10px; border-radius: 5px; color: #fff;">' +
            'Total ' +
            '<strong>' +
            data +
            '</strong> ' +
            '</div>'
          )
        },
      },
      grid: {
        position: 'back',
        borderColor: '#E0E0E0',
        strokeDashArray: 10,
      },
      dataLabels: {
        enabled: false, // Disable data labels to hide values on the area line
      },
    },
    series: [
      {
        name: 'all venues',
        data: chartValueSeries ?? [0],
      },
    ],
  }

  const tableHeader = [
    {
      key: 'Items name',
      value: 'item_name',
      sorting: true,
      sortkey: 'item_name',
      clickable: false,
      cell: ({ item_image, item_name, description }) => {
        return (
          <div className='flex items-center gap-5'>
            <img src={item_image ? item_image : noImage} alt='product-img' className='w-10 h-10 flex-shrink-0' />
            <p>
              <span className='block'>{item_name ?? '--'}</span>
              {description && <span className='block text-xs text-dark-grey'>{`${description ?? '-'}`}</span>}
            </p>
          </div>
        )
      },
    },
    {
      key: 'Sold unit',
      value: 'sold_unit',
      sorting: true,
      sortkey: 'sold_unit',
      clickable: false,
      cell: ({ sold_unit }) => {
        return <>{beautifyNumber(sold_unit)}</>
      },
    },
    {
      key: 'Unit consumed',
      value: 'unit_consumed',
      sorting: true,
      sortkey: 'unit_consumed',
      clickable: false,
      cell: ({ unit_consumed }) => {
        return <>{beautifyNumber(unit_consumed)}</>
      },
    },
    {
      key: 'Sold liquid',
      value: 'sold_liquid',
      sorting: true,
      sortkey: 'sold_liquid',
      clickable: false,
      cell: ({ sold_liquid }) => {
        return <>{beautifyNumber(sold_liquid) + ' ML'}</>
      },
    },
    {
      key: 'Liquid consumed',
      value: 'liquid_consumed',
      sorting: true,
      sortkey: 'liquid_consumed',
      clickable: false,
      cell: ({ liquid_consumed }) => {
        return <>{beautifyNumber(liquid_consumed) + ' ML'}</>
      },
    },
    {
      key: 'Variance in ML ',
      value: 'variance_in_ml',
      sorting: true,
      sortkey: 'variance_in_ml',
      clickable: false,
      cell: ({ variance_in_ml }) => {
        return <>{beautifyNumber(variance_in_ml) + ' ML'}</>
      },
    },
    {
      key: `Variance in ${generalData?.currency ?? ''}`,
      value: 'variance_in_amount',
      sorting: true,
      sortkey: 'variance_in_amount',
      clickable: false,
      cell: ({ variance_in_amount }) => {
        return (
          <>
            {variance_in_amount ? (
              <span>{`${generalData?.currency ?? ''} ${beautifyNumber(variance_in_amount) ?? '--'}`}</span>
            ) : (
              <span>--</span>
            )}
          </>
        )
      },
    },
  ]

  return (
    <div>
      <div className='flex items-center justify-between lg:flex-nowrap flex-wrap gap-3'>
        <div className='flex items-center md:gap-8 gap-3 md:order-1 order-2'>
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
      <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3 lg:mt-6 sm:mt-4 mt-3'>
        <div className='xxl:col-span-9 xl:col-span-8 lg:col-span-7 col-span-12 '>
          <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3'>
            <div className='col-span-12 lg:col-span-6'>
              <DashboardStatCard
                className={'bg-[#F2FBF3]'}
                icon={<IconProfitability />}
                statValue={staisticsData?.total_average_variance?.amount ?? 0}
                isUp={staisticsData?.total_average_variance?.is_up}
                value={`${staisticsData?.total_average_variance?.percent ?? 0}%`}
                statName={'Total average of variance'}
                tooltip={'Average variance since last full inventory'}
                expandableBG={'bg-[#F2FBF3]'}
              />
            </div>
            <div className='col-span-12 lg:col-span-6'>
              <DashboardStatCard
                className={'bg-[#fcf8f3]'}
                icon={<StockValue />}
                statValue={`${generalData?.currency ?? ''} ${staisticsData?.total_variance_cost?.amount ?? 0}`}
                isUp={staisticsData?.total_variance_cost?.is_up}
                value={`${staisticsData?.total_variance_cost?.percent ?? 0}%`}
                statName={'Total variance cost'}
                tooltip={'Variance cost since last full inventory'}
                expandableBG={'bg-[#fcf8f3]'}
              />
            </div>
          </div>
          <WhiteCard className={'lg:mt-6 sm:mt-4 mt-3'}>
            <Paragraph text20 className='font-bold mb-5'>
              Alerts and updates
            </Paragraph>
            <div className='max-h-[252px] overflow-y-auto' id={'scrollableDivalert'}>
              <InfiniteScroll
                dataLength={alertUpdateData?.length}
                next={() => {
                  if (hasMore) {
                    setAlertUpdatePage((prevPage) => prevPage + 1) // Increment page number
                  }
                }}
                hasMore={hasMore}
                loader={loading && <h4>Loading ... </h4>}
                scrollableTarget='scrollableDivalert'
              >
                {!loading && alertUpdateData?.length === 0 ? (
                  <div className='flex flex-col  justify-center w-full py-4'>
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                ) : (
                  <>
                    {alertUpdateData?.map((alert) => (
                      <NotificationItem
                        type={handleAlertUpdateIconType(alert?.update_type)}
                        info={alert.message}
                        key={alert?.id}
                      />
                    ))}
                  </>
                )}
              </InfiniteScroll>
            </div>
          </WhiteCard>
          {windowWidth > 991 && (
            <WhiteCard className={'lg:mt-6 sm:mt-4 mt-3'}>
              <div className='flex items-center justify-between gap-3 lg:mb-6 mb-4 xl:flex-nowrap flex-wrap'>
                <Paragraph text20 className='font-bold'>
                  Variance cost
                </Paragraph>
                <SelectType
                  xs
                  options={chartOptions}
                  placeholder={'Select'}
                  onChange={(option) => setSelectedChartOption(option?.value)}
                  value={chartOptions?.find((option) => option?.value === selectedChartOption) || ''}
                />
              </div>

              <div className='sm:overflow-x-visible overflow-x-auto'>
                <div className='sm:min-w-full min-w-[500px] '>
                  <Chart
                    options={salesOverview.options}
                    series={salesOverview.series}
                    type='area'
                    width={'100%'}
                    height={250}
                  />
                </div>
              </div>
            </WhiteCard>
          )}
        </div>
        <div className='xxl:col-span-3 xl:col-span-4 lg:col-span-5 col-span-12 '>
          <WhiteCard>
            <div className='border border-medium-grey rounded-lg p-2 mb-3'>
              <Paragraph text16 className={'font-bold mb-4'}>
                Item variance in Cl
              </Paragraph>
              {varianceInClData?.length > 0 ? (
                varianceInClData?.slice(0, 4)?.map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      withBorder
                      withCount
                      count={index + 1}
                      positive={item?.side_data?.is_up}
                      negative={!item?.side_data?.is_up}
                      neutral={false}
                      className='mb-1'
                      itemName={item?.item_name}
                      productImage={item?.item_image}
                      pillValue={item?.side_data?.percent}
                      imgSize={'28px'}
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
            </div>
            <div className='border border-medium-grey rounded-lg p-2'>
              <Paragraph text16 className={'font-bold mb-4'}>
                Item variance in {generalData?.currency ?? ''}
              </Paragraph>

              {varianceInAmountData?.length > 0 ? (
                varianceInAmountData?.slice(0, 4)?.map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      withBorder
                      withCount
                      count={index + 1}
                      positive={false}
                      negative={false}
                      neutral={true}
                      className='mb-1'
                      itemName={item?.item_name}
                      productImage={item?.item_image}
                      pillValue={item?.amount}
                      imgSize={'28px'}
                    />
                  )
                })
              ) : (
                <div className='flex flex-col   w-full py-4'>
                  <Paragraph text16 className={'font-semibold'}>
                    Data not found..!!
                  </Paragraph>
                </div>
              )}
            </div>
          </WhiteCard>
          {windowWidth < 992 && (
            <WhiteCard className={'lg:mt-6 sm:mt-4 mt-3'}>
              <div className='flex items-center justify-between gap-3 lg:mb-6 mb-4 xl:flex-nowrap flex-wrap'>
                <Paragraph text20 className='font-bold'>
                  Variance cost
                </Paragraph>

                <SelectType
                  xs
                  options={chartOptions}
                  placeholder={'Select'}
                  onChange={(option) => setSelectedChartOption(option?.value)}
                  value={chartOptions?.find((option) => option?.value === selectedChartOption) || ''}
                />
              </div>

              <div className='sm:overflow-x-visible overflow-x-auto'>
                <div className='sm:min-w-full min-w-[500px] '>
                  <Chart
                    options={salesOverview.options}
                    series={salesOverview.series}
                    type='area'
                    width={'100%'}
                    height={250}
                  />
                </div>
              </div>
            </WhiteCard>
          )}
        </div>
        <div className='col-span-12 '>
          <WhiteCard>
            <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 items-center'>
              <div className='md:col-span-3 col-span-12'>
                <Paragraph text20 className={''}>
                  Variance list
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

export default Variances
