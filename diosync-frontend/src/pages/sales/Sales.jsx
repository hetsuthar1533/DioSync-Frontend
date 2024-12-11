/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Paragraph from '../../components/core/typography/Paragraph'
import ThemeDatePicker from '../../components/core/formComponents/ThemeDatePicker'
import Button from '../../components/core/formComponents/Button'
import { FiUpload } from 'react-icons/fi'
import DashboardStatCard from '../../components/themeComponents/DashboardStatCard'
import { ReactComponent as StockValue } from '../../assets/images/icon_stock_val.svg'
import { ReactComponent as IconProfitability } from '../../assets/images/icon_profitability.svg'
import { BsCurrencyDollar } from 'react-icons/bs'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import Chart from 'react-apexcharts'
import SelectType from '../../components/core/formComponents/SelectType'
import productImage from '../../assets/images/product_item_one.svg'
import ListItem from '../../components/themeComponents/ListItem'
import TableLayout from '../../components/themeComponents/TableLayout'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import { chartOptions } from '../../constants/commonConstants'
import { useDispatch, useSelector } from 'react-redux'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import moment from 'moment'
import {
  GetAllSalesItemsList,
  GetSalesGraph,
  GetSalesStastics,
  GetSalesValueGraph,
  GetTopSellingLiqours,
  GetTopSellingRecipes,
} from '../../services/salesService'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetAllCategories } from '../../services/categoryService'
import noImage from '../../assets/images/noImg.png'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import { beautifyNumber } from '../../utils/commonHelper'
import { TbMoneybag } from 'react-icons/tb'

function Sales() {
  const { generalData } = useSelector(generalDataSelector)
  const tableHeader = [
    {
      key: 'Items name',
      value: 'item_name',
      sortkey: 'item_name',
      sorting: true,
      clickable: false,
      cell: ({ item_image, item_name, quantity, unit }) => {
        return (
          <div className='flex items-center gap-5'>
            <img src={item_image ? item_image : noImage} alt='product-img' className='w-10 h-10 flex-shrink-0' />
            <p>
              <span className='block'>{item_name ?? '--'}</span>

              {quantity && <span className='block text-xs text-dark-grey'>{`${quantity} ${unit}`}</span>}
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
      key: 'Sales price by unit',
      value: 'sales_price',
      sorting: true,
      sortkey: 'sales_price',
      clickable: false,
      cell: ({ sales_price }) => {
        return (
          <>{sales_price && <span>{`${generalData?.currency ?? ''} ${beautifyNumber(sales_price) ?? '--'}`}</span>}</>
        )
      },
    },
    {
      key: 'Cost %',
      value: 'cost',
      sorting: true,
      sortkey: 'cost',
      clickable: false,
      cell: ({ cost }) => {
        return <>{cost && <span>{`${beautifyNumber(cost) + '%' ?? '--'}`}</span>}</>
      },
    },
    {
      key: 'Profitability',
      value: 'profitability',
      sorting: true,
      sortkey: 'profitability',
      clickable: false,
      cell: ({ profitability }) => {
        return (
          <>
            {profitability && <span>{`${generalData?.currency ?? ''} ${beautifyNumber(profitability) ?? '--'}`}</span>}
          </>
        )
      },
    },
    {
      key: 'Profitability ranking ',
      value: 'profitability_rank',
      sorting: true,
      sortkey: 'profitability_rank',
      clickable: false,
    },
    {
      key: 'Selling ranking',
      value: 'selling_rank',
      sorting: true,
      sortkey: 'selling_rank',
      clickable: false,
    },
  ]

  const dispatch = useDispatch()
  const activeVenue = useSelector(activeVenueSelector)
  const [selectedChartOption, setSelectedChartOption] = useState(2)

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const [staisticsData, setStatisticsData] = useState({})
  const [xAxisData, setXAxisData] = useState([''])
  const [chartValueSeries, setChartValueSeries] = useState([0])
  const [maxSeries, setMaxSeries] = useState(0)

  const [topSellingRecipesData, setTopSellingRecipesData] = useState([])
  const [topSellingRecipeshasMore, setTopSellingRecipesHasMore] = useState(true)
  const [topSellingRecipesPage, setTopSellingRecipesPage] = useState(1) // Track current page
  const [loadingTopselling, setLoadingTopselling] = useState(false)
  const topSellingRecipesPerPage = 10

  const [topSellingLiquorsData, setTopSellingLiquorsData] = useState([])
  const [topSellingLiquorshasMore, settTopSellingLiquorsHasMore] = useState(true)
  const [topSellingLiquorsPage, setTopSellingLiquorsPage] = useState(1) // Track current page
  const [loadingTopsellingLiquors, setLoadingTopsellingLiquors] = useState(false)
  const topSellingLiquorsPerPage = 10

  const [categoriesListOption, setCategoriesListOption] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()

  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(false)
  const [searchItem, setSearchItem] = useState('')

  useEffect(() => {
    fetchCategories?.()
  }, [])

  useEffect(() => {
    if (activeVenue) {
      getSalesStatistics(activeVenue)
    }
  }, [startDate && endDate, activeVenue])

  useEffect(() => {
    if (activeVenue) {
      getSalesChart(activeVenue, selectedChartOption)
    }
  }, [startDate && endDate, activeVenue, selectedChartOption])

  useEffect(() => {
    if (activeVenue) {
      getTopSellingRecipesData(topSellingRecipesPage, activeVenue)
    }
  }, [topSellingRecipesPage, activeVenue])

  useEffect(() => {
    if (activeVenue) {
      getTopSellingLiquorsData(topSellingLiquorsPage, activeVenue)
    }
  }, [topSellingLiquorsPage, activeVenue])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getSalesAllData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
  }, [searchItem, orderby, order, itemOffset, startDate && endDate, activeVenue, selectedCategory])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem, selectedCategory])

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage
    setItemOffset(newOffset)
  }

  const handleSorting = (data, order) => {
    setOrderby(data)
    setOrder(order)
  }

  const getSalesStatistics = async (activeVenue) => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    const response = await GetSalesStastics(queryString)
    if (response?.status === 200) {
      setStatisticsData(response?.data?.data)
    }
    dispatch(hideLoader())
  }

  const getSalesChart = async (activeVenue, selectedChartOption) => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    if (selectedChartOption) {
      queryString += `&filter=${selectedChartOption}`
    }
    const response = await GetSalesValueGraph(queryString)
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

  const getTopSellingRecipesData = async (topSellingRecipesPage, activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${topSellingRecipesPage}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader()) // Show loader before API call
    setLoadingTopselling(true)
    try {
      const response = await GetTopSellingRecipes(queryString)
      const count = response?.data?.data?.count || 0
      if (response?.data?.data?.results) {
        setTopSellingRecipesData((prevData) => [...prevData, ...response?.data?.data?.results])
        // Stop loading more if we reach the end
        setTopSellingRecipesHasMore(topSellingRecipesPage < Math.ceil(count / topSellingRecipesPerPage))
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoadingTopselling(false)
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

  const getTopSellingLiquorsData = async (topSellingLiquorsPage, activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${topSellingLiquorsPage}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader()) // Show loader before API call
    setLoadingTopsellingLiquors(true)
    try {
      const response = await GetTopSellingLiqours(queryString)
      const count = response?.data?.data?.count || 0
      if (response?.data?.data?.results) {
        setTopSellingLiquorsData((prevData) => [...prevData, ...response?.data?.data?.results])
        // Stop loading more if we reach the end
        settTopSellingLiquorsHasMore(topSellingLiquorsPage < Math.ceil(count / topSellingLiquorsPerPage))
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoadingTopsellingLiquors(false)
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

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

  const getSalesAllData = async () => {
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
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    const response = await GetAllSalesItemsList(queryString)
    dispatch(hideLoader())
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    dispatch(hideLoader())
  }

  const state = {
    options: {
      chart: {
        id: 'apexchart-example',
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 10,
          color: '#083ED1',
          opacity: 0.8,
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
        // colors: ['#083ED1', '#00A511', '#C2780E', '#ff4560'],
      },
      colors: ['#083ED1'],
      legend: {
        position: 'top',
        fontSize: '12px',
        fontWeight: '600',
        markers: {
          size: 12,
        },
      },
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
        max: Math.ceil(maxSeries / 1000) * 1000 > 5000 ? Math.ceil(maxSeries / 1000) * 1000 : 5000,
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
    },
    series: [
      {
        name: 'Sales',
        data: chartValueSeries ?? [0],
      },
    ],
  }

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
        {/* <Button primary className={'md:w-auto w-full md:order-2 order-1'}>
          <FiUpload fontSize={'20px'} />
          Export report
        </Button> */}
      </div>
      <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3 lg:mt-6 sm:mt-4 mt-3'>
        <div className='col-span-12 xl:col-span-4 lg:col-span-6 md:col-span-4'>
          <DashboardStatCard
            className={'bg-[#f2f5fd]'}
            icon={<TbMoneybag size={20} />}
            statValue={`${generalData?.currency ?? ''} ${staisticsData?.total_sales_value?.amount ?? 0}`}
            isUp={staisticsData?.total_sales_value?.is_up}
            value={`${staisticsData?.total_sales_value?.percent ?? 0}%`}
            statName={'Total sales'}
            tooltip={'Total sales for the selected dates'}
            expandableBG={'bg-[#f2f5fd]'}
          />
        </div>
        <div className='col-span-12 xl:col-span-4 lg:col-span-6 md:col-span-4'>
          <DashboardStatCard
            className={'bg-[#F2FBF3]'}
            icon={<IconProfitability />}
            statValue={`${staisticsData?.total_number_of_sales?.amount ?? 0}`}
            isUp={staisticsData?.total_number_of_sales?.is_up}
            value={`${staisticsData?.total_number_of_sales?.percent ?? 0}%`}
            statName={'Total number of sales'}
            tooltip={'Total items sold for the selected dates'}
            expandableBG={'bg-[#F2FBF3]'}
          />
        </div>
        <div className='col-span-12 xl:col-span-4 lg:col-span-6 md:col-span-4'>
          <DashboardStatCard
            className={'bg-[#fcf8f3]'}
            icon={<StockValue />}
            statValue={`${staisticsData?.avg_cost_of_recipe?.amount ?? 0}%`}
            isUp={staisticsData?.avg_cost_of_recipe?.is_up}
            value={`${staisticsData?.avg_cost_of_recipe?.percent ?? 0}%`}
            statName={'Avg. cost of recipes'}
            tooltip={'Average cost of recipes for the selected dates'}
            expandableBG={'bg-[#fcf8f3]'}
          />
        </div>
        <div className='xxl:col-span-9 xl:col-span-8 lg:col-span-7 col-span-12 order-5 lg:order-4'>
          <WhiteCard className={'h-full'}>
            <div className='flex items-center justify-between gap-3 lg:mb-6 mb-4 xl:flex-nowrap flex-wrap'>
              <Paragraph text20 className='font-bold'>
                Sales Value
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
                <Chart options={state.options} series={state.series} type='line' width={'100%'} height={320} />
              </div>
            </div>
          </WhiteCard>
        </div>
        <div className='xxl:col-span-3 xl:col-span-4 lg:col-span-5 col-span-12 order-4 lg:order-5'>
          <WhiteCard>
            <div className='border border-medium-grey rounded-lg p-2 mb-3'>
              <Paragraph text16 className={'font-bold mb-4'}>
                Top selling recipes
              </Paragraph>
              <div id='scrollableDiv'>
                {/* <InfiniteScroll
                  dataLength={topSellingRecipesData?.length}
                  next={() => {
                    if (topSellingRecipeshasMore) {
                      setTopSellingRecipesPage((prevPage) => prevPage + 1) // Increment page number
                    }
                  }}
                  hasMore={topSellingRecipeshasMore}
                  loader={loadingTopselling && <h4>Loading ... </h4>}
                  height={200}
                  scrollableTarget='scrollableDiv'
                >*/}
                {/* {!loadingTopselling && topSellingRecipesData?.length === 0 ? (
                    <div className='flex flex-col  justify-center w-full py-4'>
                      <Paragraph text16 className={'font-semibold'}>
                        Data not found..!!
                      </Paragraph>
                    </div>
                  ) : (  */}
                <div className='border border-medium-grey rounded-lg mb-4'>
                  {topSellingRecipesData.length === 0 ? (
                    <div className='flex flex-col  justify-center w-full py-4'>
                      <Paragraph text16 className={'font-semibold'}>
                        Data not found..!!
                      </Paragraph>
                    </div>
                  ) : (
                    <>
                      {topSellingRecipesData > 0 &&
                        topSellingRecipesData?.slice(0, 3)?.map((item, index) => {
                          const isLastItem = index === topSellingRecipesData?.length - 1
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
                              pillValue={item?.side_count?.count}
                            />
                          )
                        })}
                    </>
                  )}
                </div>
                {/*)}
                </InfiniteScroll> */}
              </div>
            </div>
            <div className='border border-medium-grey rounded-lg p-2'>
              <Paragraph text16 className={'font-bold mb-4'}>
                Top selling items
              </Paragraph>
              <div id='scrollableDivliquors'>
                {/* <InfiniteScroll
                  dataLength={topSellingLiquorsData?.length}
                  next={() => {
                    if (topSellingLiquorshasMore) {
                      setTopSellingLiquorsPage((prevPage) => prevPage + 1) // Increment page number
                    }
                  }}
                  scrollableTarget='scrollableDivliquors'
                  hasMore={topSellingLiquorshasMore}
                  loader={loadingTopsellingLiquors && <h4>Loading ... </h4>}
                  height={150}
                >
                  {!loadingTopsellingLiquors && topSellingLiquorsData?.length === 0 ? (
                    <div className='flex flex-col  justify-center w-full py-4'>
                      <Paragraph text16 className={'font-semibold'}>
                        Data not found..!!
                      </Paragraph>
                    </div>
                  ) : ( */}
                <div className='border border-medium-grey rounded-lg mb-4'>
                  {topSellingLiquorsData.length === 0 ? (
                    <div className='flex flex-col  justify-center w-full py-4'>
                      <Paragraph text16 className={'font-semibold'}>
                        Data not found..!!
                      </Paragraph>
                    </div>
                  ) : (
                    <>
                      {topSellingLiquorsData?.slice(0, 3)?.map((item, index) => {
                        const isLastItem = index === topSellingLiquorsData?.length - 1
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
                    </>
                  )}
                </div>
                {/* )}
                </InfiniteScroll> */}
              </div>
            </div>
          </WhiteCard>
        </div>
        <div className='col-span-12 order-6'>
          <WhiteCard>
            <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 items-center'>
              {/* <div className='md:col-span-3 col-span-12 flex gap-2'>
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
              </div> */}
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

export default Sales
