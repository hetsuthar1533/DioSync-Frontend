/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DashboardStatCard from '../../components/themeComponents/DashboardStatCard'
import { ReactComponent as StockValue } from '../../assets/images/icon_stock_val.svg'
import { ReactComponent as IconVariance } from '../../assets/images/icon_variance.svg'
import IconInventory from '../../assets/images/icon_inventory_blue.svg'
import IconCartPlus from '../../assets/images/icon_cart_plus.svg'
import IconThreshold from '../../assets/images/icon_thresold.svg'
import { BsCurrencyDollar } from 'react-icons/bs'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import Paragraph from '../../components/core/typography/Paragraph'
import SelectType from '../../components/core/formComponents/SelectType'
import Chart from 'react-apexcharts'
import ListItem from '../../components/themeComponents/ListItem'
import Button from '../../components/core/formComponents/Button'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import {
  GetDashboardLatestUpdates,
  GetDashboardOrderAlerts,
  GetDashboardStatistics,
  GetDashboardTopSellingItems,
} from '../../services/dashboardService'
import { GetTrustIndicator } from '../../services/commonService'
import { chartOptions } from '../../constants/commonConstants'
import { GetDashboardSalesGraph } from '../../services/salesService'
import InfiniteScroll from 'react-infinite-scroll-component'
import moment from 'moment'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { userSelector } from '../../redux/slices/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import { userRoles } from '../../constants/roleConstants'
import { paths } from '../../routes/path'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import { TbMoneybag } from 'react-icons/tb'

function Dashboard() {
  useEffect(() => {
    document.title = `Dashboard - DioSync`
  }, [])
  const user_type = useSelector(userSelector)
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const dispatch = useDispatch()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [statisticsData, setStatisticsData] = useState({})
  const [trustIndicatorData, setTrustIndicatorData] = useState(0)

  //Sales-Chart
  const [selectedChartOption, setSelectedChartOption] = useState(2)
  const [xAxisData, setXAxisData] = useState([''])
  const [chartValueSeries, setChartValueSeries] = useState([0])
  const [maxSeries, setMaxSeries] = useState(0)

  //latest Update
  const [latestUpdateData, setLatestUpdateData] = useState([])
  const [latestUpdatehasMore, setLatestUpdateHasMore] = useState(true)
  const [latestUpdatePage, setLatestUpdatePage] = useState(1) // Track current page
  const [loadingLatestUpdate, setLoadingLatestUpdate] = useState(false)
  const LatestItemsPerPage = 10

  //orderAlert
  const [orderAlertData, setOrderAlertData] = useState([])
  const [orderAlerthasMore, setOrderAlertHasMore] = useState(true)
  const [orderAlertPage, setOrderAlertPage] = useState(1) // Track current page
  const [loadingOrderAlert, setLoadingOrderAlert] = useState(false)
  const orderAlertPerPage = 10

  //Sellers
  const [topSellingItemsData, setTopSellingItemsData] = useState([])
  const [topSellingItemshasMore, settTopSellingItemsHasMore] = useState(true)
  const [topSellingItemsPage, setTopSellingItemsPage] = useState(1) // Track current page
  const [loadingTopselling, setLoadingTopselling] = useState(false)
  const topSellingItemsPerPage = 10

  const resetAllStateChange = () => {
    setLatestUpdateData([])
    setLatestUpdateHasMore(true)
    setLatestUpdatePage(1)
    setLoadingLatestUpdate(false)
    setOrderAlertData([])
    setOrderAlertHasMore(true)
    setOrderAlertPage(1)
    setLoadingOrderAlert(false)
    setTopSellingItemsData([])
    settTopSellingItemsHasMore(true)
    setTopSellingItemsPage(1)
    setLoadingTopselling(false)
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

  useEffect(() => {
    if (activeVenue && activeVenue > 0) {
      getStatisticsData(activeVenue)
      getTrustIndicator(activeVenue)
    }
  }, [activeVenue])

  useEffect(() => {
    if (activeVenue && activeVenue > 0) {
      resetAllStateChange()
      getLatestUpdateData(1, activeVenue)
      getOrderAlertData(1, activeVenue)
      getTopSellingItemsData(1, activeVenue)
    } else {
    }
  }, [activeVenue])

  useEffect(() => {
    if (latestUpdatePage > 1) getLatestUpdateData(latestUpdatePage, activeVenue)
  }, [latestUpdatePage])

  useEffect(() => {
    if (orderAlertPage > 1) getOrderAlertData(orderAlertPage, activeVenue)
  }, [orderAlertPage])

  useEffect(() => {
    if (topSellingItemsPage > 1) getTopSellingItemsData(topSellingItemsPage, activeVenue)
  }, [topSellingItemsPage])

  useEffect(() => {
    if (selectedChartOption && activeVenue) {
      getSalesGraph(selectedChartOption, activeVenue)
    }
  }, [selectedChartOption, activeVenue])

  const getStatisticsData = async (activeVenue) => {
    dispatch(showLoader())
    const queryString = `?bar_vanue_id=${activeVenue}`
    const response = await GetDashboardStatistics(queryString)
    if (response?.status === 200) {
      setStatisticsData(response?.data?.data)
    }
    dispatch(hideLoader())
  }

  const getTrustIndicator = async () => {
    dispatch(showLoader())
    const queryString = `?bar_vanue_id=${activeVenue}`
    const response = await GetTrustIndicator(queryString)
    if (response?.status === 200) {
      setTrustIndicatorData(response?.data?.data?.trust_indicator)
    }
    dispatch(hideLoader())
  }

  const getSalesGraph = async (value, activeVenue) => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}&filter=${value}`
    const response = await GetDashboardSalesGraph(queryString)
    if (response?.status === 200) {
      if (Array.isArray(response?.data?.data)) {
        const arrDateAxis = response?.data?.data?.map((object) => object?.name) ?? []
        const series = response?.data?.data?.map((object) => object?.value) ?? []
        const maxofSeries = Math.max(...series)
        setMaxSeries(maxofSeries)
        setXAxisData(arrDateAxis)
        setChartValueSeries(series)
      }
    }
    dispatch(hideLoader())
  }

  const getLatestUpdateData = async (latestUpdatePage, activeVenue) => {
    if (activeVenue > 0) {
      let queryString = `?bar_vanue_id=${activeVenue}&page=${latestUpdatePage}`
      dispatch(showLoader()) // Show loader before API call
      setLoadingLatestUpdate(true)
      try {
        const response = await GetDashboardLatestUpdates(queryString)
        const count = response?.data?.data?.count || 0
        if (response?.data?.data?.results) {
          setLatestUpdateData((prevData) => [...prevData, ...response?.data?.data?.results])

          // Stop loading more if we reach the end
          setLatestUpdateHasMore(latestUpdatePage < Math.ceil(count / LatestItemsPerPage))
        }
      } catch (error) {
        console.error('Error fetching feed:', error)
      } finally {
        setLoadingLatestUpdate(false)
        dispatch(hideLoader()) // Hide loader after API call
      }
    }
  }

  const getOrderAlertData = async (orderAlertPage, activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${orderAlertPage}`
    dispatch(showLoader()) // Show loader before API call
    setLoadingOrderAlert(true)
    try {
      const response = await GetDashboardOrderAlerts(queryString)
      const count = response?.data?.data?.count || 0
      if (response?.data?.data?.results) {
        setOrderAlertData((prevData) => [...prevData, ...response?.data?.data?.results])

        // Stop loading more if we reach the end
        setOrderAlertHasMore(orderAlertPage < Math.ceil(count / orderAlertPerPage))
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoadingOrderAlert(false)
      dispatch(hideLoader()) // Hide loader after API call
    }
  }
  const getTopSellingItemsData = async (topSellingItemsPage, activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${topSellingItemsPage}`
    dispatch(showLoader()) // Show loader before API call
    setLoadingTopselling(true)
    try {
      const response = await GetDashboardTopSellingItems(queryString)
      const count = response?.data?.data?.count || 0
      if (response?.data?.data?.results) {
        setTopSellingItemsData((prevData) => [...prevData, ...response?.data?.data?.results])
        // Stop loading more if we reach the end
        settTopSellingItemsHasMore(topSellingItemsPage < Math.ceil(count / topSellingItemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoadingTopselling(false)
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

  const trustIndicator = {
    options: {
      chart: {
        height: '180',
        type: 'radialBar',
      },
      colors: ['#00A511'],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '50%',
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false, // Hide the label
            },
            value: {
              color: '#00A511',
              fontSize: '24px',
              show: true,
              offsetY: 8,
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
      responsive: [
        {
          breakpoint: 3600,
          options: {
            chart: {
              height: 180,
            },
          },
        },
        {
          breakpoint: 1440,
          options: {
            chart: {
              height: 160,
            },
          },
        },
        {
          breakpoint: 576, // Add a separate breakpoint for 575
          options: {
            chart: {
              height: 160,
            },
          },
        },
      ],
    },
    series: [trustIndicatorData ?? 0],
  }
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
        max: Math.ceil(maxSeries / 200000) * 200000 > 1000000 ? Math.ceil(maxSeries / 200000) * 200000 : 1000000,
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
        name: 'venuwise',
        data: chartValueSeries ?? [0],
      },
    ],
  }

  return (
    <>
      {/* Single Venue Dashboard */}
      <div className='grid xl:grid-cols-3 grid-cols-1 gap-3'>
        <div className='xl:col-span-2 col-span-2 xl:order-1 order-2'>
          {/* First column items */}
          {windowWidth > 1199 && (
            <div className='grid grid-cols-12 gap-3 mb-3'>
              <div className='col-span-12 xl:col-span-4 md:col-span-6'>
                <DashboardStatCard
                  className={'bg-[#f2f5fd]'}
                  icon={<IconVariance />}
                  statName={'Variance'}
                  statValue={`${generalData?.currency ?? ''} ${statisticsData?.variance?.amount ?? 0}`}
                  isUp={statisticsData?.is_up?.is_up}
                  value={`${statisticsData?.variance?.percent ?? 0}%`}
                  tooltip={'Variance since last full inventory'}
                  expandableBG={'bg-[#f2f5fd]'}
                />
              </div>
              <div className='col-span-12 xl:col-span-4 md:col-span-6'>
                <DashboardStatCard
                  className={'bg-[#F2FBF3]'}
                  icon={<TbMoneybag />}
                  statValue={`${generalData?.currency ?? ''} ${statisticsData?.yesterday_sales?.amount ?? 0}`}
                  isUp={statisticsData?.yesterday_sales?.is_up}
                  value={`${statisticsData?.yesterday_sales?.percent ?? 0}%`}
                  statName={"Yesterday's Sales"}
                  tooltip={"Yesterday's Sales"}
                  expandableBG={'bg-[#F2FBF3]'}
                />
              </div>
              <div className='col-span-12 xl:col-span-4 md:col-span-6'>
                <DashboardStatCard
                  className={'bg-[#fcf8f3]'}
                  icon={<StockValue />}
                  statValue={`${generalData?.currency ?? ''} ${statisticsData?.stock_value?.amount ?? 0}`}
                  isUp={statisticsData?.stock_value?.is_up}
                  value={`${statisticsData?.stock_value?.percent ?? 0}%`}
                  statName={'Stock Value'}
                  tooltip={'Total stock value from last full inventory'}
                  expandableBG={'bg-[#fcf8f3]'}
                />
              </div>
            </div>
          )}
          {/* Sales Overview */}
          <WhiteCard className={'mb-3 !pb-0'}>
            <div className='flex items-center justify-between gap-3 xl:flex-nowrap flex-wrap'>
              <Paragraph text20 className='font-bold'>
                <Link to={user_type === userRoles?.Manager ? paths?.manager?.sales : paths?.owner?.sales}>
                  Sales Overview
                </Link>
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
              <div className=''>
                <Chart
                  options={salesOverview.options}
                  series={salesOverview.series}
                  type='area'
                  width={'100%'}
                  height={220}
                />
              </div>
            </div>
          </WhiteCard>
          {/* Latest Updates */}
          <WhiteCard className={'xxl:min-h-[300px] min-h-[auto]'}>
            <Paragraph text20 className='font-bold mb-3'>
              Latest Updates
            </Paragraph>
            <ul className='max-h-[340px] overflow-y-auto' id={'scrollableDiv'}>
              <InfiniteScroll
                dataLength={latestUpdateData?.length}
                next={() => {
                  if (latestUpdatehasMore) {
                    setLatestUpdatePage((prevPage) => prevPage + 1) // Increment page number
                  }
                }}
                hasMore={latestUpdatehasMore}
                loader={loadingLatestUpdate && <h4>Loading ... </h4>}
                height={150}
                scrollableTarget='scrollableDiv'
              >
                {!loadingLatestUpdate && latestUpdateData?.length === 0 ? (
                  <div className='flex flex-col  justify-center w-full py-4'>
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                ) : (
                  latestUpdateData?.map((item, index) => {
                    const isLastItem = index === latestUpdateData?.length - 1
                    return (
                      <li
                        className={`flex gap-4 items-center sm:px-2 sm:py-2 px-0 py-2  ${isLastItem ? 'border-0' : 'border-b'} border-medium-grey`}
                        key={index}
                      >
                        <div className='flex items-center gap-2'>
                          <span
                            className={`w-8 h-8 rounded flex flex-shrink-0 items-center justify-center ${item?.type === 'inventory' ? 'bg-primary-blue/10' : item?.type === 'cart' ? 'bg-site-green/10' : 'bg-site-yellow/10'}`}
                          >
                            <img
                              src={
                                item?.update_type === 'FULL INVENTORY' ||
                                item?.update_type === 'QUICK INVENTORY' ||
                                item?.update_type === 'BREAKAGE & LOSS' ||
                                item?.update_type === 'COST_CHANGE'
                                  ? IconInventory
                                  : item?.update_type === 'ORDER'
                                    ? IconCartPlus
                                    : IconThreshold
                              }
                              alt='icons'
                            />
                          </span>
                          <div className='flex items-center gap-4'>
                            <Paragraph text14 className='font-semibold text-site-black line-clamp-1'>
                              {item?.message}
                              <span> on {moment(item?.created_at).format('DD.MMM.YY')} </span>
                            </Paragraph>
                            {/* {item?.new && (
                            <span className='bg-primary-blue text-white text-xs leading-[18px] font-semibold rounded px-2 py-1'>
                              New
                            </span>
                          )} */}
                          </div>
                        </div>
                      </li>
                    )
                  })
                )}
              </InfiniteScroll>
            </ul>
          </WhiteCard>
        </div>
        <div className='xl:col-span-1 col-span-2 xl:order-2 order-1'>
          {/* Second column items */}
          {windowWidth < 1200 && (
            <div className='grid grid-cols-12 gap-3 mb-3'>
              <div className='col-span-12 xl:col-span-4 md:col-span-6'>
                <DashboardStatCard
                  className={'bg-[#f2f5fd]'}
                  icon={<IconVariance />}
                  statName={'Variance'}
                  statValue={`${generalData?.currency ?? ''} ${statisticsData?.variance?.amount ?? 0}`}
                  isUp={statisticsData?.is_up?.is_up}
                  value={`${statisticsData?.variance?.percent ?? 0}%`}
                  tooltip={'Variance since last full inventory'}
                  tooltipPosition={'bottom center'}
                  expandableBG={'bg-[#f2f5fd]'}
                />
              </div>
              <div className='col-span-12 xl:col-span-4 md:col-span-6'>
                <DashboardStatCard
                  className={'bg-[#F2FBF3]'}
                  icon={<TbMoneybag />}
                  statValue={`${generalData?.currency ?? ''} ${statisticsData?.yesterday_sales?.amount ?? 0}`}
                  isUp={statisticsData?.yesterday_sales?.is_up}
                  value={`${statisticsData?.yesterday_sales?.percent ?? 0}%`}
                  statName={"Yesterday's Sales"}
                  tooltip={"Yesterday's Sales"}
                  expandableBG={'bg-[#F2FBF3]'}
                />
              </div>
              <div className='col-span-12 xl:col-span-4 md:col-span-6'>
                <DashboardStatCard
                  className={'bg-[#fcf8f3]'}
                  icon={<StockValue />}
                  statValue={`${generalData?.currency ?? ''} ${statisticsData?.stock_value?.amount ?? 0}`}
                  isUp={statisticsData?.stock_value?.is_up}
                  value={`${statisticsData?.stock_value?.percent ?? 0}%`}
                  statName={'Stock Value'}
                  tooltip={'Total stock value from last full inventory'}
                  expandableBG={'bg-[#fcf8f3]'}
                />
              </div>
            </div>
          )}
          <WhiteCard className='mb-3 xl:!py-0 '>
            <div className='flex lg:flex-nowrap flex-wrap xl:items-center xs:items-center items-start xs:flex-row flex-col xs:gap-1 gap-4  justify-between xxl:h-[141px] xl:h-[124px] h-[140px] relative'>
              <Paragraph text20 className='font-bold'>
                Trust Indicator
              </Paragraph>
              <Chart
                options={trustIndicator.options}
                series={trustIndicator.series}
                type='radialBar'
                height={trustIndicator.options.chart.height}
                // className='absolute xxl:top-[50%] xxl:translate-y-[-50%] xxl:-right-[100px] xxl:bottom-[inherit] xxl:left-[inherit] xl:top-[inherit] xl:-bottom-[20px] xl:translate-y-[inherit] xl:-left-[100px] xs:top-[50%] xs:translate-y-[-50%] xs:-right-[100px] xs:bottom-[inherit] xs:left-[inherit] -bottom-[20px] -left-[100px]'
                className='absolute xl:top-[50%] xl:translate-y-[-50%] xl:-right-[100px] xl:bottom-[inherit] xl:left-[inherit]  xs:top-[50%] xs:translate-y-[-50%] xs:-right-[100px] xs:bottom-[inherit] xs:left-[inherit] -bottom-[20px] -left-[100px]'
              />
            </div>
          </WhiteCard>
          <WhiteCard className={'mb-3'}>
            <Paragraph text20 className='font-bold mb-3'>
              Order alert
            </Paragraph>
            <div id={'scrollableDivorder'}>
              <InfiniteScroll
                dataLength={orderAlertData?.length}
                next={() => {
                  if (orderAlerthasMore) {
                    setOrderAlertPage((prevPage) => prevPage + 1) // Increment page number
                  }
                }}
                hasMore={orderAlerthasMore}
                loader={loadingOrderAlert && <h4>Loading ... </h4>}
                height={210}
                scrollableTarget='scrollableDivorder'
              >
                {!loadingOrderAlert && orderAlertData?.length === 0 ? (
                  <div className='flex flex-col  justify-center w-full py-4'>
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                ) : (
                  <div className='border border-medium-grey rounded-lg'>
                    {orderAlertData?.map((item, index) => {
                      const isLastItem = index === orderAlertData?.length - 1
                      return (
                        <ListItem
                          key={index}
                          defaultItem
                          withCount
                          {...(!isLastItem && { borderBottom: true })}
                          negative={true}
                          cart={true}
                          className='mb-0'
                          itemName={item?.item_name}
                          productImage={item?.item_image}
                          pillValue={item?.down_by ?? 0}
                          pillValueLink={user_type === userRoles?.Manager ? paths?.manager?.cart : paths?.owner?.cart}
                        />
                      )
                    })}
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </WhiteCard>
          <WhiteCard className={''}>
            <Paragraph text20 className='font-bold mb-3'>
              Top selling items by categories
            </Paragraph>
            <div id={'scrollableDivcat'}>
              <InfiniteScroll
                dataLength={topSellingItemsData?.length}
                next={() => {
                  if (topSellingItemshasMore) {
                    setTopSellingItemsPage((prevPage) => prevPage + 1) // Increment page number
                  }
                }}
                hasMore={topSellingItemshasMore}
                loader={loadingTopselling && <h4>Loading ... </h4>}
                height={150}
                scrollableTarget='scrollableDivcat'
              >
                {!loadingTopselling && topSellingItemsData?.length === 0 ? (
                  <div className='flex flex-col  justify-center w-full py-4'>
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                ) : (
                  <div className='border border-medium-grey rounded-lg mb-4'>
                    {topSellingItemsData?.map((item, index) => {
                      const isLastItem = index === topSellingItemsData?.length - 1
                      return (
                        <ListItem
                          key={index}
                          defaultItem
                          withCount
                          {...(!isLastItem && { borderBottom: true })}
                          negative={!item?.side_count?.is_up}
                          positive={item?.side_count?.is_up}
                          count={index + 1}
                          className='mb-0'
                          itemName={item?.item_name}
                          productImage={item?.item_image}
                          pillValue={item?.side_count?.count}
                        />
                      )
                    })}
                  </div>
                )}
              </InfiniteScroll>
            </div>
            {/* <div className='text-center'>
              <Button primary small>
                Review Top Sellers
              </Button>
            </div> */}
          </WhiteCard>
        </div>
      </div>
    </>
  )
}

export default Dashboard
