/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DashboardStatCard from '../../components/themeComponents/DashboardStatCard'
import { ReactComponent as StockValue } from '../../assets/images/icon_stock_val.svg'
import { ReactComponent as IconVariance } from '../../assets/images/icon_variance.svg'
import { ReactComponent as IconProfitability } from '../../assets/images/icon_profitability.svg'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import Paragraph from '../../components/core/typography/Paragraph'
import SelectType from '../../components/core/formComponents/SelectType'
import RadioButton from '../../components/core/formComponents/RadioButton'
import Chart from 'react-apexcharts'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { GetDashboardMultiVenueSalesAnalytics, GetDashboardMultiVenueStatistics } from '../../services/dashboardService'
import { GetMultiVenueTopSale } from '../../services/inventoryService'
import { chartOptions } from '../../constants/commonConstants'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import { TbMoneybag } from 'react-icons/tb'

function MultiVenueDashboard() {
  const { generalData } = useSelector(generalDataSelector)
  const dispatch = useDispatch()
  const [statisticsData, setStatisticsData] = useState({})
  const [expendableStockData, setExpendableStockData] = useState([])
  const [expendableSalesData, setExpendableSalesData] = useState([])
  const [expendableVarinaceData, setExpendableVarinaceData] = useState([])
  const [expendableProfitabilityData, setExpendableProfitabilityData] = useState([])

  const [chartRadioValue, setchartRadioValue] = useState('split')
  const [selectedChartOption, setSelectedChartOption] = useState(2)
  const [xAxisData, setXAxisData] = useState([''])
  const [chartAllValueSeries, setChartAllValueSeries] = useState([0])
  const [chartSplitValueSeries, setChartSplitValueSeries] = useState([0])
  const [maxSeries, setMaxSeries] = useState(0)

  const [donutChartLabels, setDonutChartLabels] = useState([])
  const [donutChartPercent, setDonutChartPercent] = useState([])
  const [donutTotal, setDonutTotal] = useState(0)

  useEffect(() => {
    getStatisticsData()
    getTopSalesGraph()
  }, [])

  useEffect(() => {
    if (selectedChartOption) {
      getSalesGraph(selectedChartOption)
    }
  }, [selectedChartOption])

  useEffect(() => {
    getChartValues()
  }, [chartRadioValue])

  const getChartValues = () => {
    if (chartRadioValue === 'all') {
      return chartAllValueSeries
    } else if (chartRadioValue === 'split') {
      return chartSplitValueSeries
    } else {
      return []
    }
  }

  const getStatisticsData = async () => {
    dispatch(showLoader())
    const response = await GetDashboardMultiVenueStatistics()
    if (response?.status === 200) {
      setStatisticsData(response?.data?.data)
      setExpendableStockData(
        response?.data?.data?.split_vanue.map((vanue) => ({
          label: vanue?.bar_vanue_name,
          value: `${generalData?.currency ?? ''} ${vanue?.data?.stock_value?.amount}`,
        })),
      )
      setExpendableSalesData(
        response?.data?.data?.split_vanue.map((vanue) => ({
          label: vanue?.bar_vanue_name,
          value: `${generalData?.currency ?? ''} ${vanue?.data?.yesterday_sales?.amount}`,
        })),
      )
      setExpendableVarinaceData(
        response?.data?.data?.split_vanue.map((vanue) => ({
          label: vanue?.bar_vanue_name,
          value: `${generalData?.currency ?? ''} ${vanue?.data?.veriance?.amount}`,
        })),
      )
      setExpendableProfitabilityData(
        response?.data?.data?.split_vanue.map((vanue) => ({
          label: vanue?.bar_vanue_name,
          value: `${generalData?.currency ?? ''} ${vanue?.data?.profitability?.amount}`,
        })),
      )
    }
    dispatch(hideLoader())
  }

  const getTopSalesGraph = async (value) => {
    dispatch(showLoader())
    const response = await GetMultiVenueTopSale()
    if (response?.status === 200) {
      const labels = response?.data?.data?.total_sales?.data?.map((object) => object?.name)
      const valueInPercent = response?.data?.data?.total_sales?.data?.map((object) => object?.percent)
      setDonutChartLabels(labels)
      setDonutChartPercent(valueInPercent)
      setDonutTotal(response?.data?.data?.total_sales?.total)
    }
    dispatch(hideLoader())
  }

  const getSalesGraph = async (value) => {
    dispatch(showLoader())
    let queryString = `?filter=${value}`
    const response = await GetDashboardMultiVenueSalesAnalytics(queryString)
    if (response?.status === 200) {
      // setOverAllSalesData(response?.data?.data)
      const arrDateAxis = response?.data?.data?.name || []
      const multiVenueData = response?.data?.data?.value.filter((item) => item.name === 'multi_vanue') || []
      const otherData = response?.data?.data?.value.filter((item) => item.name !== 'multi_vanue') || []
      const allDataValues = response?.data?.data?.value?.flatMap((series) => series.data)
      const maxValue = Math.max(...allDataValues)
      setMaxSeries(maxValue)
      setXAxisData(arrDateAxis)
      setChartAllValueSeries(multiVenueData)
      setChartSplitValueSeries(otherData)
    }
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
      colors: ['#083ED1', '#00A511', '#C2780E', '#ff4560'],
      legend: {
        position: 'top',
        fontSize: '12px',
        fontWeight: '600',
        markers: {
          size: 12,
        },
      },
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
        max: Math.ceil(maxSeries / 200000) * 200000 > 1000000 ? Math.ceil(maxSeries / 200000) * 200000 : 1000000,
        step: 7,
        labels: {
          style: {
            colors: '#919297',
            fontSize: '14px',
            fontWeight: 600,
          },
          formatter: function (value) {
            return `${generalData?.currency ?? ''} ` + value?.toLocaleString()
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
    series: getChartValues(),
  }
  const totalVenueState = {
    options: {
      chart: {
        id: 'total-sales',
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
        position: 'bottom',
        fontSize: '12px',
        fontWeight: '600',
        fontFamily: 'Open Sans, sans-serif',
        labels: {
          colors: '#919297',
        },
        markers: {
          size: 12,
        },
        formatter: function (seriesName, opts) {
          // Extract the series data and the index of the series
          const value = opts.w.globals.series[opts?.seriesIndex]
          return `${seriesName} ${value?.toFixed(2)}%` // Format the legend label with value
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
            size: '85%',
            labels: {
              show: true,
              name: {
                fontSize: '12px',
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                formatter: function (w) {
                  return donutTotal ? `${generalData?.currency ?? ''} ` + donutTotal : 0
                },
              },
            },
          },
          expandOnClick: false,
        },
      },
      stroke: {
        show: false, // Disable stroke
        width: 0, // Set stroke width to 0
      },
      colors: ['#083ED1', '#00A511', '#C2780E'],
      fill: {
        type: 'solid',
      },
      // labels: ['Gin', 'Vodka', 'Rum'], // Ensure this is set correctly
      labels: donutChartLabels ?? [], // Ensure this is set correctly
    },
    // series: [33.33, 33.33, 33.33], // Data series
    series: donutChartPercent ?? [], // Data series
  }

  return (
    <>
      {/* Statistics Blocks  */}
      <div className=''>
        <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3 lg:mb-6 sm:mb-4 mb-3'>
          <div className='col-span-12 xl:col-span-3 md:col-span-6'>
            <DashboardStatCard
              className={'bg-[#F2FBF3]'}
              icon={<StockValue />}
              statValue={`${generalData?.currency ?? ''} ${statisticsData?.multi_vanue?.stock_value?.amount ?? 0}`}
              isUp={statisticsData?.multi_vanue?.stock_value?.is_up?.is_up}
              value={`${statisticsData?.multi_vanue?.stock_value?.percent ?? 0}%`}
              statName={'Total Stock Value'}
              tooltip={'Total stock value from last full inventory'}
              expandable
              expandableItem={expendableStockData}
              expandableBG={'bg-[#F2FBF3]'}
              tooltipPosition='bottom center'
            />
          </div>
          <div className='col-span-12 xl:col-span-3 md:col-span-6'>
            <DashboardStatCard
              className={'bg-[#fcf8f3]'}
              icon={<TbMoneybag size={20} />}
              statValue={`${generalData?.currency ?? ''} ${statisticsData?.multi_vanue?.yesterday_sales?.amount ?? 0}`}
              isUp={statisticsData?.multi_vanue?.yesterday_sales?.is_up?.is_up}
              value={`${statisticsData?.multi_vanue?.yesterday_sales?.percent ?? 0}%`}
              statName={"Yesterday's Sales"}
              tooltip={"Yesterday's Sales"}
              expandable
              expandableItem={expendableSalesData}
              expandableBG={'bg-[#fcf8f3]'}
            />
          </div>
          <div className='col-span-12 xl:col-span-3 md:col-span-6'>
            <DashboardStatCard
              className={'bg-[#f2f5fd]'}
              icon={<IconVariance />}
              statValue={`${generalData?.currency ?? ''} ${statisticsData?.multi_vanue?.veriance?.amount ?? 0}`}
              isUp={statisticsData?.multi_vanue?.veriance?.is_up?.is_up}
              value={`${statisticsData?.multi_vanue?.veriance?.percent ?? 0}%`}
              statName={'Total Variance'}
              tooltip={'Variance since last full inventory'}
              expandable
              expandableItem={expendableVarinaceData}
              expandableBG={'bg-[#f2f5fd]'}
            />
          </div>
          <div className='col-span-12 xl:col-span-3 md:col-span-6'>
            <DashboardStatCard
              className={'bg-[#fcf2f2]'}
              icon={<IconProfitability />}
              statValue={`${generalData?.currency ?? ''} ${statisticsData?.multi_vanue?.profitability?.amount ?? 0}`}
              isUp={statisticsData?.multi_vanue?.profitability?.is_up?.is_up}
              value={`${statisticsData?.multi_vanue?.profitability?.percent ?? 0}%`}
              statName={'Total Profitability'}
              tooltip={'Total Profitability'}
              expandable
              expandableItem={expendableProfitabilityData}
              expandableBG={'bg-[#fcf2f2]'}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3'>
          {/* Sales Analytics */}
          <div className='xxl:col-span-9 lg:col-span-8 md:col-span-7 col-span-12'>
            <WhiteCard>
              <div className='flex items-center justify-between gap-3 lg:mb-6 mb-4 xl:flex-nowrap flex-wrap'>
                <Paragraph text20 className='font-bold'>
                  Sales Analytics
                </Paragraph>
                <div className='flex items-center md:gap-6 gap-3 lg:flex-nowrap flex-wrap'>
                  <div className='flex items-center sm:gap-6 gap-3 sm:flex-nowrap flex-wrap'>
                    <RadioButton
                      name={'radio1'}
                      id={'all'}
                      labelClass={'whitespace-nowrap'}
                      onChange={() => {
                        setchartRadioValue('all')
                      }}
                      checked={chartRadioValue === 'all' ? true : false}
                    >
                      <Paragraph className={'sm:text-[20px] sm:leading-[30px] text-[18px] leading-[28px] font-bold'}>
                        All Venues
                      </Paragraph>
                    </RadioButton>
                    <RadioButton
                      name='radio1'
                      id={'split'}
                      labelClass={'whitespace-nowrap'}
                      onChange={() => {
                        setchartRadioValue('split')
                      }}
                      checked={chartRadioValue === 'split' ? true : false}
                    >
                      <Paragraph className={'sm:text-[20px] sm:leading-[30px] text-[18px] leading-[28px] font-bold'}>
                        Split Venues
                      </Paragraph>
                    </RadioButton>
                  </div>
                  <SelectType
                    xs
                    options={chartOptions}
                    placeholder={'Select'}
                    onChange={(option) => setSelectedChartOption(option?.value)}
                    value={chartOptions?.find((option) => option?.value === selectedChartOption) || ''}
                  />
                </div>
              </div>
              <div className='sm:overflow-x-visible overflow-x-auto'>
                <div className='sm:min-w-full min-w-[500px] '>
                  <Chart options={state.options} series={state.series} type='line' width={'100%'} height={300} />
                </div>
              </div>
            </WhiteCard>
          </div>
          {/* Total Sales */}
          <div className='xxl:col-span-3 lg:col-span-4 md:col-span-5 col-span-12'>
            <WhiteCard className={'h-full'}>
              <Paragraph text20 className='font-bold lg:mb-10 sm:mb-8 mb-6'>
                Total Sales
              </Paragraph>
              <Chart
                options={totalVenueState?.options}
                series={totalVenueState?.series}
                type='donut'
                width={'100%'}
                height={300}
              />
            </WhiteCard>
          </div>
        </div>
      </div>
    </>
  )
}

export default MultiVenueDashboard
