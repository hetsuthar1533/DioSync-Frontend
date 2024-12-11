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

function Inventory() {
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const trustIndicator = {
    options: {
      chart: {
        width: '240',
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
    series: [72],
  }
  const categoryStocks = {
    options: {
      chart: {
        redrawOnWindowResize: true,
        id: 'category-stocks',
        width: 360,
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
        offsetY: 0,
        labels: {
          colors: '#080808',
        },
        markers: {
          size: 4,
        },
        formatter: function (seriesName, opts) {
          const value = opts.w.globals.series[opts.seriesIndex]
          return `<span class='legend-text'>${seriesName}</span><span class="text-dark-grey">${value}%</span> <span class="">${value}%</span>`
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
                  return '$' + w.globals.seriesTotals.reduce((a, b) => a + b, 0)
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
      labels: ['Soft', 'Water', 'Spirit', 'Beer'],
      responsive: [
        {
          breakpoint: 3600,
          options: {
            chart: {
              width: 360,
            },
            legend: {
              position: 'right',
            },
          },
        },
        {
          breakpoint: 1399,
          options: {
            chart: {
              width: 360,
            },
            legend: {
              position: 'right',
            },
          },
        },
        {
          breakpoint: 576, // Add a separate breakpoint for 575
          options: {
            chart: {
              width: 320,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 420, // Add a separate breakpoint for 575
          options: {
            chart: {
              height: 280,
              width: 230,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
    series: [25, 25, 25, 25],
  }

  const tableHeader = [
    {
      key: 'Items name',
      value: 'item_name',
      sorting: false,
      clickable: false,
      nameWithSublabel: true,
      subValue: 'sub_name',
      productImg: 'product_img',
    },
    {
      key: 'Quantity',
      value: 'quantity',
      sorting: true,
      clickable: false,
    },
    {
      key: 'Purch. Cost',
      value: 'cost_by_unit',
      sorting: true,
      clickable: false,
    },
    {
      key: 'Stock Value',
      value: 'stock_value',
      sorting: true,
      clickable: false,
    },
    {
      key: 'Res. Threshold ',
      value: 'threshold',
      sorting: false,
      clickable: false,
    },
    { key: 'Avg. Daily Use', value: 'avg_daily_use', sorting: true, clickable: false },
    { key: 'Cart', value: 'cart', sorting: false, clickable: true },
    {
      key: 'Actions',
      value: 'actions',
      sorting: false,
      clickable: false,
    },
  ]

  let data = [
    {
      product_img: productImage,
      item_name: 'Vodka Absolut',
      sub_name: '75cl',
      quantity: '5.5 L',
      cost_by_unit: '47',
      stock_value: '$ 258,5',
      threshold: '5',
      avg_daily_use: '6 L',
    },
    {
      item_name: 'Hendricks',
      sub_name: '1l',
      quantity: '7.8 L',
      cost_by_unit: '61',
      stock_value: '$ 432,5',
      threshold: '3',
      avg_daily_use: '10 L',
    },
  ]

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage
    // setCurrentItems(data?.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(data?.length / itemsPerPage))
  }, [itemOffset, itemsPerPage, data])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length
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

  const tableFilter = [
    {
      label: 'Category',
      value: 'category',
    },
    {
      label: 'Category two',
      value: 'category_two',
    },
  ]

  return (
    <div>
      {windowWidth < 1400 && (
        <div className='grid grid-cols-12 lg:gap-5 sm:gap-4 gap-3 lg:mb-6 sm:mb-4 mb-3'>
          <div className='col-span-12 xl:col-span-3 md:col-span-12'>
            <div className='flex xl:flex-col sm:flex-row flex-col gap-5'>
              <DashboardStatCard
                className={'bg-[#f2f5fd] h-auto w-full'}
                icon={<StockValue />}
                increasedValue={'15%'}
                statValue={'$18.528'}
                statName={'Stock Value'}
                tooltip={'Total stock value from last full inventory'}
                expandableBG={'bg-[#f2f5fd]'}
              />
              <DashboardStatCard
                className={'bg-[#fcf8f3] h-auto w-full'}
                icon={<IconClock />}
                statValue={'16 Sept.24'}
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
                width={trustIndicator.options.chart.width}
              />
            </div>
          </div>
          <div className='col-span-12 xl:col-span-6 md:col-span-7 '>
            <div className='bg-primary-blue/5 rounded-lg p-4 h-full'>
              <Paragraph text20 className='font-bold mb-5'>
                Stock by Categories
              </Paragraph>
              <Chart
                options={categoryStocks.options}
                series={categoryStocks.series}
                type='donut'
                className='chart-left'
                height={categoryStocks.options.chart.height}
              />
            </div>
          </div>
        </div>
      )}
      {windowWidth > 1399 && (
        <div className='flex xxl:flex-nowrap flex-wrap lg:-mx-[10px] sm:-mx-2 -mx-[6px] lg:mb-6 sm:mb-4 mb-3 '>
          <div className='lg:px-[10px] sm:px-2 px-[6px] xxl:w-full md:w-2/5 w-full xxl:mb-0 md:mb-5 mb-3'>
            <DashboardStatCard
              className={'bg-[#f2f5fd] h-auto w-full'}
              icon={<StockValue />}
              increasedValue={'15%'}
              statValue={'$18.528'}
              statName={'Stock Value'}
              tooltip={'Total stock value from last full inventory'}
              expandableBG={'bg-[#f2f5fd]'}
            />
          </div>
          <div className='lg:px-[10px] sm:px-2 px-[6px] xxl:w-full md:w-3/5 w-full xxl:mb-0 md:mb-5 mb-3'>
            <div className='bg-primary-blue/5 rounded-lg p-4 h-full'>
              <Paragraph text20 className='font-bold mb-5'>
                Stock by Categories
              </Paragraph>
              <Chart
                options={categoryStocks.options}
                series={categoryStocks.series}
                type='donut'
                className='chart-left'
                width={categoryStocks.options.chart.width}
              />
            </div>
          </div>
          <div className='lg:px-[10px] sm:px-2 px-[6px] xxl:w-full sm:w-1/2 w-full xxl:mb-0 sm:mb-0 md:mb-4 mb-3'>
            <DashboardStatCard
              className={'bg-[#fcf8f3] h-full w-full'}
              icon={<IconClock />}
              statValue={'16 Sept.24'}
              statName={'Last full inventory'}
              expandableBG={'bg-[#fcf8f3]'}
            />
          </div>
          <div className='lg:px-[10px] sm:px-2 px-[6px] xxl:w-full sm:w-1/2 w-full xxl:mb-0 sm:mb-0 md:mb-4 mb-3'>
            <div className='bg-site-green/5 rounded-lg p-4 h-full'>
              <Paragraph text20 className='font-bold'>
                Trust Indicator
              </Paragraph>
              <Chart
                options={trustIndicator.options}
                series={trustIndicator.series}
                type='radialBar'
                width={trustIndicator.options.chart.width}
              />
            </div>
          </div>
        </div>
      )}
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
                setSearchItem={''}
                searchItem={''}
                setPage={''}
                placeholder={'Search'}
                className={'sm:w-auto w-full'}
                iconRight
                sm
              />
              <SelectType sm options={tableFilter} onChange={handleOptions}></SelectType>
            </div>
          </div>
          <div className='col-span-12'>
            <TableLayout
              tableHeader={tableHeader}
              handleOptions={handleOptions}
              currentItems={data}
              isEdit={true}
              isDelete={true}
              isView={true}
              handlePageClick={handlePageClick}
              pageCount={pageCount}
              itemOffset={itemOffset}
              itemsPerPage={itemsPerPage}
              handleSorting={handleSorting}
            />
          </div>
        </div>
      </WhiteCard>
    </div>
  )
}

export default Inventory
