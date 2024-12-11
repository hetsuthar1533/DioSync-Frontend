/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Paragraph from '../../components/core/typography/Paragraph'
import ThemeDatePicker from '../../components/core/formComponents/ThemeDatePicker'
import Button from '../../components/core/formComponents/Button'
import { FiUpload } from 'react-icons/fi'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import Chart from 'react-apexcharts'
import SelectType from '../../components/core/formComponents/SelectType'
import productImage from '../../assets/images/product_item_one.svg'
import ListItem from '../../components/themeComponents/ListItem'
import TableLayout from '../../components/themeComponents/TableLayout'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import { PiArrowDownBold, PiArrowUpBold } from 'react-icons/pi'
import ToolTip from '../../components/core/ToolTip'
import { LuInfo } from 'react-icons/lu'
import { IoNotificationsOutline } from 'react-icons/io5'
import InfiniteScroll from 'react-infinite-scroll-component'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import {
  GetAllPurchaseList,
  GetMostPurchasedCategories,
  GetMostPurchasedProducts,
  GetMostPurchaseExpenditure,
  GetPurchaseAlert,
  GetPurchaseGraph,
} from '../../services/purchaseService'
import moment from 'moment'
import { chartOptions } from '../../constants/commonConstants'
import noImage from '../../assets/images/noImg.png'
import { GetAllCategories } from '../../services/categoryService'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import { beautifyNumber } from '../../utils/commonHelper'

function Purchase() {
  const dispatch = useDispatch()
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const [mostPurchasedCategoriesData, setMostPurchasedCategoriesData] = useState([])
  const [mostPurchasedCategorieshasMore, setMostPurchasedCategoriesHasMore] = useState(true)
  const [mostPurchasedCategoriesPage, setMostPurchasedCategoriesPage] = useState(1) // Track current page
  const [loadingMostPurchasedCategories, setLoadingMostPurchasedCategories] = useState(false)
  const mostPurchasedCategoriesPerPage = 10

  const [mostPurchasedProductsData, setMostPurchasedProductsData] = useState([])
  const [mostPurchasedProductshasMore, setMostPurchasedProductsHasMore] = useState(true)
  const [mostPurchasedProductsPage, setMostPurchasedProductsPage] = useState(1) // Track current page
  const [loadingMostPurchasedProducts, setLoadingMostPurchasedProducts] = useState(false)
  const mostPurchasedProductsPerPage = 10

  const [totalExpenditureData, setTotalExpenditureData] = useState({})

  const [purchaseAlertData, setPurchaseAlertData] = useState({})

  const [selectedChartOption, setSelectedChartOption] = useState(2)
  const [xAxisData, setXAxisData] = useState([''])
  const [chartValueSeries, setChartValueSeries] = useState([0])
  const [maxSeries, setMaxSeries] = useState(0)

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
    if (activeVenue) {
      getMostPurchasedCategoriesData(mostPurchasedCategoriesPage, activeVenue)
    }
  }, [mostPurchasedCategoriesPage, activeVenue, startDate && endDate])

  useEffect(() => {
    if (activeVenue) {
      getMostPurchasedProductsData(mostPurchasedProductsPage, activeVenue)
    }
  }, [mostPurchasedProductsPage, activeVenue, startDate && endDate])

  useEffect(() => {
    getTotalPurchaseExpenditure(activeVenue)
  }, [activeVenue, startDate && endDate])

  useEffect(() => {
    getPurchaseAlertdData(activeVenue)
  }, [activeVenue])

  useEffect(() => {
    getPurchaseValueChart(activeVenue, selectedChartOption)
  }, [activeVenue, startDate && endDate, selectedChartOption])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getPurchaseAllData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
  }, [searchItem, orderby, order, itemOffset, startDate && endDate, activeVenue, selectedCategory])

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

  const getMostPurchasedCategoriesData = async (mostPurchasedCategoriesPage, activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${mostPurchasedCategoriesPage}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader()) // Show loader before API call
    setLoadingMostPurchasedCategories(true)
    try {
      const response = await GetMostPurchasedCategories(queryString)
      const count = response?.data?.data?.count || 0
      if (response?.data?.data?.results) {
        setMostPurchasedCategoriesData((prevData) => [...prevData, ...response?.data?.data?.results])
        // Stop loading more if we reach the end
        setMostPurchasedCategoriesHasMore(
          mostPurchasedCategoriesPage < Math.ceil(count / mostPurchasedCategoriesPerPage),
        )
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoadingMostPurchasedCategories(false)
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

  const getMostPurchasedProductsData = async (mostPurchasedProductsPage, activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}&page=${mostPurchasedProductsPage}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader()) // Show loader before API call
    setLoadingMostPurchasedCategories(true)
    try {
      const response = await GetMostPurchasedProducts(queryString)
      const count = response?.data?.data?.count || 0
      if (response?.data?.data?.results) {
        setMostPurchasedProductsData((prevData) => [...prevData, ...response?.data?.data?.results])
        // Stop loading more if we reach the end
        setMostPurchasedProductsHasMore(mostPurchasedProductsPage < Math.ceil(count / mostPurchasedProductsPerPage))
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoadingMostPurchasedProducts(false)
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

  const getTotalPurchaseExpenditure = async (activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    dispatch(showLoader())
    try {
      const response = await GetMostPurchaseExpenditure(queryString)
      if (response?.status === 200) {
        setTotalExpenditureData(response?.data?.data)
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      dispatch(hideLoader())
    }
  }

  const getPurchaseAlertdData = async (activeVenue) => {
    let queryString = `?bar_vanue_id=${activeVenue}`
    dispatch(showLoader())
    try {
      const response = await GetPurchaseAlert(queryString)
      if (response?.status === 200) {
        setPurchaseAlertData(response?.data?.data)
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      dispatch(hideLoader())
    }
  }

  const getPurchaseValueChart = async (activeVenue, selectedChartOption) => {
    dispatch(showLoader())
    let queryString = `?bar_vanue_id=${activeVenue}`
    if (startDate && endDate) {
      queryString += `&from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}`
    }
    if (selectedChartOption) {
      queryString += `&filter=${selectedChartOption}`
    }
    const response = await GetPurchaseGraph(queryString)
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

  const getPurchaseAllData = async () => {
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
    const response = await GetAllPurchaseList(queryString)
    dispatch(hideLoader())
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    dispatch(hideLoader())
  }

  const purchaseValueCost = {
    options: {
      chart: {
        id: 'purchaseValueCost',
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
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '20px',
        },
      },
      colors: ['#083ED1'],
      xaxis: {
        categories: xAxisData ?? [],
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
            '<div style="background: #333; padding: 10px; border-radius: 5px; color: #fff; position: relative; overflow: visible;">' +
            'Total ' +
            '<strong>' +
            data +
            '</strong> ' +
            '<span class = "absolute -bottom-[7px] left-0 right-0 mx-auto bg-primary-blue w-[14px] h-[14px] rounded-full border-2 border-white z-10"></span>' +
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
        enabled: false,
      },
    },
    locales: [null],
    series: [
      {
        name: 'all Purchase History',
        data: chartValueSeries ?? [],
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
      key: 'Purchased unit',
      value: 'purchased_unit',
      sorting: true,
      sortkey: 'purchased_unit',
      clickable: false,
    },
    {
      key: 'Total purchase cost',
      value: 'total_price',
      sorting: true,
      sortkey: 'total_price',
      clickable: false,
      cell: ({ total_price }) => {
        return (
          <>{total_price && <span>{`${generalData?.currency ?? ''} ${beautifyNumber(total_price) ?? '--'}`}</span>}</>
        )
      },
    },
    {
      key: 'Purchased rank in unit',
      value: 'purchased_rank_in_unit',
      sorting: true,
      sortkey: 'purchased_rank_in_unit',
      clickable: false,
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
        {/* <Button primary className={'md:w-auto w-full md:order-2 order-1'}>
          <FiUpload fontSize={'20px'} />
          Export report
        </Button> */}
      </div>
      <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3 lg:mt-6 sm:mt-4 mt-3'>
        <div className='xl:col-span-4 md:col-span-6 col-span-12'>
          <WhiteCard p20 className={'h-full'}>
            <Paragraph text20 className={'font-bold mb-4'}>
              Most purchased categories
            </Paragraph>
            <div id='scrollableDiv'>
              <InfiniteScroll
                dataLength={mostPurchasedCategoriesData?.length}
                next={() => {
                  if (mostPurchasedCategorieshasMore) {
                    setMostPurchasedCategoriesPage((prevPage) => prevPage + 1) // Increment page number
                  }
                }}
                hasMore={mostPurchasedCategorieshasMore}
                loader={loadingMostPurchasedCategories && <h4>Loading ... </h4>}
                height={200}
                scrollableTarget='scrollableDiv'
              >
                {!loadingMostPurchasedCategories && mostPurchasedCategoriesData?.length === 0 ? (
                  <div className='flex flex-col  justify-center w-full py-4'>
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                ) : (
                  <div className='border border-medium-grey rounded-lg'>
                    {mostPurchasedCategoriesData?.slice(0, 4)?.map((item, index) => {
                      const isLastItem = index === mostPurchasedCategoriesData?.length - 1
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
                          percent={`${item?.percent}%` ?? '-'}
                        />
                      )
                    })}
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </WhiteCard>
        </div>
        <div className='xl:col-span-4 md:col-span-6 col-span-12'>
          <WhiteCard p20 className={'h-full'}>
            <Paragraph text20 className={'font-bold mb-4'}>
              Most purchased products
            </Paragraph>
            <div id='scrollableDiv'>
              <InfiniteScroll
                dataLength={mostPurchasedProductsData?.length}
                next={() => {
                  if (mostPurchasedProductshasMore) {
                    setMostPurchasedProductsPage((prevPage) => prevPage + 1) // Increment page number
                  }
                }}
                hasMore={mostPurchasedProductshasMore}
                loader={loadingMostPurchasedProducts && <h4>Loading ... </h4>}
                height={200}
                scrollableTarget='scrollableDiv'
              >
                {!loadingMostPurchasedProducts && mostPurchasedProductsData?.length === 0 ? (
                  <div className='flex flex-col  justify-center w-full py-4'>
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                ) : (
                  <div className='border border-medium-grey rounded-lg'>
                    {mostPurchasedProductsData?.slice(0, 4)?.map((item, index) => {
                      const isLastItem = index === mostPurchasedProductsData?.length - 1
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
                          percent={`${item?.percent}%` ?? '-'}
                        />
                      )
                    })}
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </WhiteCard>
        </div>
        <div className='xl:col-span-4 lg:col-span-12 md:col-span-6 col-span-12'>
          <WhiteCard className={'mb-5'}>
            <div className='flex items-center gap-3 justify-between'>
              <Paragraph text14 className={'text-dark-grey'}>
                Total expenditure of the current month
              </Paragraph>
              <div className='flex items-center gap-3'>
                <span className='inline-flex items-center gap-[2px] bg-[#00A5111A] px-2 py-1 rounded-[30px] text-site-green text-base leading-[22px] font-semibold'>
                  {totalExpenditureData?.side_data?.is_up ? <PiArrowUpBold /> : <PiArrowDownBold />}
                  {totalExpenditureData?.side_data?.percentage}%
                </span>
                <ToolTip tooltip={'Total purchase value for the current month'}>
                  <LuInfo fontSize={'20px'} />
                </ToolTip>
              </div>
            </div>
            <Paragraph text24 className={'text-center mt-6'}>
              {generalData?.currency ?? ''} {totalExpenditureData?.amount ?? 0}
            </Paragraph>
          </WhiteCard>

          <div className='border border-[#EB5757] bg-[#EB5757]/10 p-4 rounded-lg flex flex-col items-center justify-center'>
            <div className='w-12 h-12 rounded-lg bg-[#EB5757] flex items-center justify-center text-white mb-5'>
              <IoNotificationsOutline fontSize={'20px'} color={'#fff'} />
            </div>
            <Paragraph text16 className={'font-semibold mb-1'}>
              {purchaseAlertData?.message ? 'Alert' : 'No Alert'}
            </Paragraph>
            <Paragraph text14 className={'!font-normal text-center'}>
              {purchaseAlertData?.message ? purchaseAlertData?.message : ''}
            </Paragraph>
          </div>
        </div>
        <div className='col-span-12'>
          <WhiteCard className={''}>
            <div className='flex items-center justify-between gap-3 lg:mb-6 mb-4 xl:flex-nowrap flex-wrap'>
              <Paragraph text20 className='font-bold'>
                Purchase value history
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
                  options={purchaseValueCost.options}
                  series={purchaseValueCost.series}
                  type='bar'
                  width={'100%'}
                  height={250}
                />
              </div>
            </div>
          </WhiteCard>
        </div>
        <div className='col-span-12'>
          <WhiteCard>
            <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 items-center'>
              <div className='md:col-span-3 col-span-12'>
                <Paragraph text20 className={''}>
                  Purchase list
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
    </div>
  )
}

export default Purchase
