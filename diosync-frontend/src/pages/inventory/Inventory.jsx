/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DashboardStatCard from '../../components/themeComponents/DashboardStatCard'
import { ReactComponent as StockValue } from '../../assets/images/icon_stock_val.svg'
import { ReactComponent as IconClock } from '../../assets/images/icon_clock.svg'
import Paragraph from '../../components/core/typography/Paragraph'
import Chart from 'react-apexcharts'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import TableLayout from '../../components/themeComponents/TableLayout'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import SelectType from '../../components/core/formComponents/SelectType'
import productImage from '../../assets/images/product_item_one.svg'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import {
  GetTopSaleInvenotry,
  GetInventoryStockList,
  AddToCart,
  UpdateInventoryQuantity,
} from '../../services/inventoryService'
import { useDispatch, useSelector } from 'react-redux'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { GetGeneralData, GetTrustIndicator } from '../../services/commonService'
import noImage from '../../assets/images/noImg.png'
import { generalDataSelector, setGeneral } from '../../redux/slices/generalDataSlice'
import { loadDataSelector } from '../../redux/slices/loadDataSlice'
import { beautifyNumber } from '../../utils/commonHelper'

function Inventory() {
  const loadData = useSelector(loadDataSelector)
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const dispatch = useDispatch()
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])

  const [searchItem, setSearchItem] = useState('')
  const [statisticsData, setStatisticsData] = useState({})
  const [trustIndicatorData, setTrustIndicatorData] = useState(0)

  const [chartLabel, setChartLabel] = useState([''])
  const [chartData, setChartData] = useState([])
  const [chartPercent, setChartPercent] = useState([])
  const [chartValueTotal, setChartValueTotal] = useState(0)

  useEffect(() => {
    if (loadData && activeVenue) {
      getAPIResponse()
      getTrustIndicator()
      getStockListData()
    }
  }, [loadData])

  useEffect(() => {
    if (activeVenue) {
      getAPIResponse()
      getTrustIndicator()
      getStockListData()
    }
  }, [activeVenue])

  useEffect(() => {
    const debounce = setTimeout(() => {
      getStockListData()
    }, 300)
    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset, activeVenue])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getAPIResponse = async () => {
    const queryString = `?bar_vanue_id=${activeVenue}`
    const response = await GetTopSaleInvenotry(queryString)
    if (response?.status === 200) {
      setStatisticsData(response?.data?.data)
      setChartData(response?.data?.data?.stock_by_category?.data?.slice(0, 5))
      setChartLabel(response?.data?.data?.stock_by_category?.data?.slice(0, 5)?.map((object) => object?.name) ?? [''])
      setChartPercent(
        response?.data?.data?.stock_by_category?.data?.slice(0, 5)?.map((object) => object?.percent) ?? [0],
      )
      setChartValueTotal(response?.data?.data?.stock_by_category?.total ?? 0)
    }
  }

  const getStockListData = async () => {
    if (activeVenue) {
      const orderVal = order ? '' : '-'
      let queryString = `?bar_vanue_id=${activeVenue}&page=${itemOffset / itemsPerPage + 1}`
      if (orderby) {
        queryString += `&ordering=${orderVal}${orderby}`
      }
      if (searchItem) {
        queryString += `&search=${searchItem}`
      }
      const response = await GetInventoryStockList(queryString)
      dispatch(hideLoader())
      const results = response?.data?.data?.results || []
      const count = response?.data?.data?.count || 0
      setTotalCount(count)
      setCurrentItems(results)
      setPageCount(Math.ceil(count / itemsPerPage))
    }
  }

  const getTrustIndicator = async () => {
    dispatch(showLoader())
    const queryString = `?bar_vanue_id=${activeVenue}`
    const response = await GetTrustIndicator(queryString)
    if (response?.status === 200) {
      setTrustIndicatorData(response?.data?.data?.trust_indicator ?? 0)
    }
    dispatch(hideLoader())
  }

  const handleAddtoCart = async (data, type) => {
    if (activeVenue > 0 && data?.selectedItem && data?.cartQuantity > 0) {
      if (type === 'full_unit')
        await AddToCart(
          {
            bar_venue: activeVenue,
            item: data?.selectedItem,
            qty_of_unit: data?.cartQuantity,
            qty_of_case: 0,
          },
          activeVenue,
        )
      else {
        await AddToCart(
          {
            bar_venue: activeVenue,
            item: data?.selectedItem,
            qty_of_case: data?.cartQuantity,
            qty_of_unit: 0,
          },
          activeVenue,
        )
      }
      fetchData(activeVenue)
    }
  }
  const fetchData = async (activeVenue) => {
    dispatch(showLoader())

    try {
      const queryString = `?bar_vanue_id=${activeVenue}`
      const response = await GetGeneralData(queryString)
      if (response?.status === 200) {
        dispatch(setGeneral({ ...response?.data?.data }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      dispatch(hideLoader()) // Hide loader after API call
    }
  }

  const handleInventoryQuantity = async (data) => {
    if (activeVenue > 0 && data?.selectedItem && data?.Quantity >= 0) {
      await UpdateInventoryQuantity({
        bar_vanue: activeVenue,
        item_id: data?.selectedItem,
        quantity: data?.Quantity,
      })
    }
    getStockListData()
    getAPIResponse()
    getTrustIndicator()
  }

  const trustIndicator = {
    options: {
      chart: {
        height: '240',
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
              fontSize: '30px',
              show: true,
              offsetY: 10,
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
  const categoryStocks = {
    options: {
      chart: {
        redrawOnWindowResize: true,
        id: 'category-stocks',
        height: 180,
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
      legend: {
        position: 'right',
        horizontalAlign: 'center',
        fontSize: '12px',
        fontWeight: '600',
        fontFamily: 'Open Sans, sans-serif',
        padding: 0,
        offsetY: 0,
        labels: {
          colors: '#080808',
        },
        markers: {
          size: 4,
        },
        formatter: function (seriesName, opts) {
          if (seriesName) {
            const percentageValue = chartData[opts.seriesIndex]?.percent || 0 // Get percentage from chartPercent
            const categoryValue = chartData[opts.seriesIndex]?.value || 0 // Get actual data value from chartData
            return `<span class='legend-text text-nowrap'>${seriesName}</span><span class="text-dark-grey text-nowrap">${percentageValue}%</span> <span class="text-nowrap">${categoryValue}</span>`
          }
          return ''
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
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                formatter: function (w) {
                  return chartValueTotal ? `${generalData?.currency ?? ''} ${chartValueTotal}` : 0
                },
              },
            },
            expandOnClick: false,
          },
        },
      },
      stroke: {
        lineCap: 'round',
        show: false,
        width: 0,
      },
      colors: ['#C2780E', '#00A511', '#CB0303', '#083ED1'],
      fill: {
        type: 'solid',
      },
      labels: chartLabel ?? [''],
      responsive: [
        {
          breakpoint: 3200,
          options: {
            chart: {
              height: 180,
            },
            legend: {
              position: 'right',
            },
          },
        },
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 340,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 340,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
    series: chartPercent?.length ? chartPercent : [],
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

              {description && <span className='block text-xs text-dark-grey'>{`${description ?? ''}`}</span>}
            </p>
          </div>
        )
      },
    },

    {
      key: 'Quantity',
      value: 'quantity',
      sorting: true,
      sortkey: 'quantity',
      clickable: false,
      cell: ({ quantity }) => {
        return <>{beautifyNumber(quantity)}</>
      },
    },
    {
      key: 'Purch. Cost',
      value: 'cost_by_unit',
      sortkey: 'cost_by_unit',
      sorting: true,
      clickable: false,
      cell: ({ cost_by_unit }) => {
        return <>{beautifyNumber(cost_by_unit)}</>
      },
    },
    {
      key: 'Stock Value',
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
      key: 'Res. Threshold ',
      value: 'res_threshold',
      sorting: true,
      sortkey: 'res_threshold',
      clickable: false,
      cell: ({ res_threshold }) => {
        return <>{beautifyNumber(res_threshold)}</>
      },
    },
    {
      key: 'Avg. Daily Use',
      value: 'avg_daily_use',
      sorting: true,
      sortkey: 'avg_daily_use',
      clickable: false,
    },
    { key: 'Cart', value: 'cart', sorting: false, clickable: true },
    {
      key: 'Edit Quantity',
      value: 'editQty',
      sorting: false,
      clickable: true,
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
    <div>
      <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 lg:mb-6 sm:mb-4 mb-3'>
        <div className='col-span-12 xl:col-span-3 md:col-span-12'>
          <div className='flex xl:flex-col sm:flex-row flex-col gap-5'>
            <DashboardStatCard
              className={'bg-[#f2f5fd] h-auto w-full'}
              icon={<StockValue />}
              increasedValue={`${statisticsData?.stock_value?.percent ?? 0} %`}
              statValue={`${generalData?.currency ?? ''} ${statisticsData?.stock_value?.amount ?? 0}`}
              isUp={statisticsData?.stock_value?.is_up}
              statName={'Stock Value'}
              tooltip={'Total stock value from last full inventory'}
              expandableBG={'bg-[#f2f5fd]'}
              tooltipPosition='bottom center'
            />
            <DashboardStatCard
              className={'bg-[#fcf8f3] h-auto w-full'}
              icon={<IconClock />}
              statValue={statisticsData?.last_full_inventory ?? ''}
              statName={'Last full inventory'}
              expandableBG={'bg-[#fcf8f3]'}
            />
          </div>
        </div>
        <div className='col-span-12 xl:col-span-3  md:col-span-5'>
          <div className='bg-site-green/5 rounded-lg p-4 h-full'>
            <Paragraph text20 className='font-bold'>
              Trust Indicator
            </Paragraph>
            <Chart
              options={trustIndicator.options}
              series={trustIndicator.series}
              type='radialBar'
              height={trustIndicator.options.chart.height}
            />
          </div>
        </div>
        <div className='col-span-12 xl:col-span-6 md:col-span-7 '>
          <div className='bg-primary-blue/5 rounded-lg p-4 h-full'>
            <Paragraph text20 className='font-bold mb-5'>
              Stock by Categories
            </Paragraph>
            <Chart
              options={categoryStocks?.options}
              series={categoryStocks?.series}
              type='donut'
              className='chart-left'
              height={categoryStocks?.options?.chart?.height}
            />
          </div>
        </div>
      </div>
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
                setPage={''}
                placeholder={'Search'}
                className={'sm:w-auto w-full'}
                iconRight
                sm
              />
              {/* <SelectType
                sm
                options={tableFilter}
                onChange={handleOptions}
              ></SelectType> */}
            </div>
          </div>
          <div className='col-span-12'>
            <TableLayout
              tableHeader={tableHeader}
              totalCount={totalCount}
              handleOptions={handleOptions}
              currentItems={currentItems}
              isEdit={false}
              isDelete={false}
              isView={false}
              handlePageClick={handlePageClick}
              pageCount={pageCount}
              itemOffset={itemOffset}
              itemsPerPage={itemsPerPage}
              handleSorting={handleSorting}
              handleAddtoCart={handleAddtoCart}
              handleInventoryQuantity={handleInventoryQuantity}
            />
          </div>
        </div>
      </WhiteCard>
    </div>
  )
}

export default Inventory
