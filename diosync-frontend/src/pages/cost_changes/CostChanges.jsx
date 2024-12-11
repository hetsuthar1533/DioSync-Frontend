/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Paragraph from '../../components/core/typography/Paragraph'
import DashboardStatCard from '../../components/themeComponents/DashboardStatCard'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import Chart from 'react-apexcharts'
import SelectType from '../../components/core/formComponents/SelectType'
import productImage from '../../assets/images/product_item_one.svg'
import ListItem from '../../components/themeComponents/ListItem'
import TableLayout from '../../components/themeComponents/TableLayout'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import NotificationItem from '../../components/themeComponents/NotificationItem'
import { AiOutlineDollarCircle } from 'react-icons/ai'
import { chartOptions } from '../../constants/commonConstants'
import { useDispatch, useSelector } from 'react-redux'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { AiOutlinePercentage } from 'react-icons/ai'
import {
  GetAllCostItemList,
  GetCostChangesAlertAndUpdates,
  GetCostChangesGraph,
  GetCostChangesStastics,
  GetMostInflatedItems,
} from '../../services/costChangesService'
import noImage from '../../assets/images/noImg.png'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetAllCategories } from '../../services/categoryService'
import Button from '../../components/core/formComponents/Button'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import { beautifyNumber } from '../../utils/commonHelper'

function CostChanges() {
  const dispatch = useDispatch()
  const activeVenue = useSelector(activeVenueSelector)
  const { generalData } = useSelector(generalDataSelector)
  const [staisticsData, setStatisticsData] = useState({})
  const [alertUpdateData, setAlertUpdateData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [alertUpdatePage, setAlertUpdatePage] = useState(1) // Track current page
  const [loading, setLoading] = useState(false)
  const alertItemsPerPage = 10

  const [selectedChartOption, setSelectedChartOption] = useState(2)
  const [xAxisData, setXAxisData] = useState([''])
  const [chartValueSeries, setChartValueSeries] = useState([0])
  const [maxSeries, setMaxSeries] = useState(0)

  const [mostInflatedItemsData, setMostInflatedItemsData] = useState([])
  const [mostInflatedItemshasMore, setMostInflatedItemsHasMore] = useState(true)
  const [mostInflatedItemsPage, setMostInflatedItemsPage] = useState(1) // Track current page
  const [loadingMostInflatedItems, setLoadingMostInflatedItems] = useState(false)
  const mostInflatedItemsPerPage = 10

  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(false)
  const [searchItem, setSearchItem] = useState('')

  const [categoriesListOption, setCategoriesListOption] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage
    setItemOffset(newOffset)
  }

  const handleSorting = (data, order) => {
    setOrderby(data)
    setOrder(order)
  }

  useEffect(() => {
    getCostChangesStatistics()
  }, [activeVenue])

  useEffect(() => {
    getAlertUpdateData()
  }, [activeVenue, alertUpdatePage])

  useEffect(() => {
    getCostStatusChart(activeVenue, selectedChartOption)
  }, [activeVenue, selectedChartOption])

  useEffect(() => {
    if (activeVenue) {
      getMostInflatedData(mostInflatedItemsPage, activeVenue)
    }
  }, [mostInflatedItemsPage, activeVenue])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getCostChangesAllData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
  }, [searchItem, orderby, order, itemOffset, activeVenue, selectedCategory])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem, selectedCategory])

  useEffect(() => {
    fetchCategories?.()
  }, [])

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

  const getCostChangesStatistics = async () => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}`

    const response = await GetCostChangesStastics(queryString)
    if (response?.status === 200) {
      setStatisticsData(response?.data?.data)
    }
    dispatch(hideLoader())
  }

  const getAlertUpdateData = async () => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${alertUpdatePage}`
    dispatch(showLoader()) // Show loader before API call
    setLoading(true)
    try {
      const response = await GetCostChangesAlertAndUpdates(queryString)
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

  const getCostStatusChart = async (activeVenue, selectedChartOption) => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (selectedChartOption) {
      queryString += `&filter=${selectedChartOption}`
    }
    const response = await GetCostChangesGraph(queryString)
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

  const getMostInflatedData = async (mostInflatedItemsPage, activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${mostInflatedItemsPage}`

    dispatch(showLoader()) // Show loader before API call
    setLoadingMostInflatedItems(true)
    try {
      const response = await GetMostInflatedItems(queryString)
      const count = response?.data?.data?.count || 0
      if (response?.data?.data?.results) {
        setMostInflatedItemsData((prevData) => [...prevData, ...response?.data?.data?.results])
        // Stop loading more if we reach the end
        setMostInflatedItemsHasMore(mostInflatedItemsPage < Math.ceil(count / mostInflatedItemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoadingMostInflatedItems(false)
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

  const getCostChangesAllData = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?bar_vanue_id=${activeVenue}&page=${itemOffset / itemsPerPage + 1}`
    if (selectedCategory) {
      queryString += `&filter=${selectedCategory}`
    }
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    const response = await GetAllCostItemList(queryString)
    dispatch(hideLoader())
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    dispatch(hideLoader())
  }

  const costStatus = {
    options: {
      chart: {
        id: 'costStatus',
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
        max: Math.ceil(maxSeries / 5000) * 5000 > 20000 ? Math.ceil(maxSeries / 5000) * 5000 : 20000,
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
      key: 'Current cost',
      value: 'current_cost',
      sorting: true,
      sortkey: 'current_cost',
      clickable: false,
      cell: ({ current_cost }) => {
        return (
          <>{current_cost && <span>{`${generalData?.currency ?? ''} ${beautifyNumber(current_cost) ?? '--'}`}</span>}</>
        )
      },
    },
    {
      key: 'Last registered price',
      value: 'last_registered_price',
      sorting: true,
      sortkey: 'last_registered_price',
      clickable: false,
      cell: ({ last_registered_price }) => {
        return (
          <>
            {last_registered_price && (
              <span>{`${generalData?.currency ?? ''} ${beautifyNumber(last_registered_price) ?? '--'}`}</span>
            )}
          </>
        )
      },
    },
    {
      key: 'Inflation on last price',
      value: 'inflation_on_last_price',
      sorting: true,
      sortkey: 'inflation_on_last_price',
      clickable: false,
      cell: ({ inflation_on_last_price }) => {
        return <>{inflation_on_last_price && <span>{`${inflation_on_last_price ?? '--'}%`}</span>}</>
      },
    },
    {
      key: 'Base price ',
      value: 'base_price',
      sorting: true,
      sortkey: 'base_price',
      clickable: false,
      cell: ({ base_price }) => {
        return (
          <>{base_price && <span>{`${generalData?.currency ?? ''} ${beautifyNumber(base_price) ?? '--'}`}</span>}</>
        )
      },
    },
    {
      key: 'Inflation on base price',
      value: 'inflation_on_base_price',
      sorting: true,
      sortkey: 'inflation_on_base_price',
      clickable: false,
      cell: ({ inflation_on_base_price }) => {
        return <>{inflation_on_base_price && <span>{`${inflation_on_base_price ?? '--'}%`}</span>}</>
      },
    },
  ]

  return (
    <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3'>
      <div className='xl:col-span-4 md:col-span-6 col-span-12'>
        <DashboardStatCard
          className={'bg-[#f2f5fd]'}
          icon={<AiOutlinePercentage size={'18'} />}
          statValue={`${staisticsData?.value_of_cost_change?.amount ?? 0}%`}
          isUp={staisticsData?.value_of_cost_change?.is_up}
          value={`${staisticsData?.value_of_cost_change?.percent ?? 0}%`}
          statName={'Value of cost change'}
          tooltip={'Value of cost change'}
          expandableBG={'bg-[#f2f5fd]'}
        />
      </div>
      <div className='xl:col-span-8 md:col-span-6 col-span-12'>
        <WhiteCard>
          <Paragraph text20 className='font-bold mb-5'>
            Alerts and updates
          </Paragraph>
          <div className='max-h-[124px] overflow-y-auto' id={'scrollableDivalert'}>
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
                    <NotificationItem className={'!py-1'} type={'primary'} info={alert.message} key={alert?.id} />
                  ))}
                </>
              )}
            </InfiniteScroll>
          </div>
        </WhiteCard>
      </div>
      <div className='xl:col-span-8 md:col-span-6 col-span-12'>
        <WhiteCard className={''}>
          <div className='flex items-center justify-between gap-3 lg:mb-6 mb-4 xl:flex-nowrap flex-wrap'>
            <Paragraph text20 className='font-bold'>
              Cost status
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
              <Chart options={costStatus.options} series={costStatus.series} type='area' width={'100%'} height={250} />
            </div>
          </div>
        </WhiteCard>
      </div>
      <div className='xl:col-span-4 md:col-span-6 col-span-12'>
        <WhiteCard className={'h-full'}>
          <Paragraph text20 className={'font-bold mb-6'}>
            Most inflated items
          </Paragraph>
          <div id='scrollableDivInflateds'>
            {/* <InfiniteScroll
              dataLength={mostInflatedItemsData?.length}
              next={() => {
                if (mostInflatedItemshasMore) {
                  setMostInflatedItemsPage((prevPage) => prevPage + 1) // Increment page number
                }
              }}
              hasMore={mostInflatedItemshasMore}
              loader={loadingMostInflatedItems && <h4>Loading ... </h4>}
              height={270}
              scrollableTarget='scrollableDivInflateds'
            >
              {!loadingMostInflatedItems && mostInflatedItemsData?.length === 0 ? (
                <div className='flex flex-col  justify-center w-full py-4'>
                  <Paragraph text16 className={'font-semibold'}>
                    Data not found..!!
                  </Paragraph>
                </div>
              ) : (*/}
            <div className='border border-medium-grey rounded-lg'>
              {mostInflatedItemsData?.slice(0, 6)?.map((item, index) => {
                const isLastItem = index === mostInflatedItemsData?.length - 1
                return (
                  <ListItem
                    key={index}
                    defaultItem
                    withCount
                    {...(!isLastItem && { borderBottom: true })}
                    negative={false}
                    positive={false}
                    count={index + 1}
                    className='mb-0'
                    itemName={item?.item_name}
                    productImage={item?.item_image}
                    percent={`${item?.item_count}%` ?? '-'}
                  />
                )
              })}
            </div>
            {/* )}
            </InfiniteScroll> */}
          </div>
        </WhiteCard>
      </div>
      <div className='col-span-12 '>
        <WhiteCard>
          <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 items-center'>
            <div className='md:col-span-3 col-span-12'>
              <Paragraph text20 className={''}>
                Cost item list
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
                {/* <SelectType
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
                )} */}
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
  )
}

export default CostChanges
