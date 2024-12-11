/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import TableLayout from '../../components/themeComponents/TableLayout'
import { DELETE, UPDATE } from '../../constants/roleConstants'
import Paragraph from '../../components/core/typography/Paragraph'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import Button from '../../components/core/formComponents/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { GetOrderDetailById } from '../../services/historyService'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import noImage from '../../assets/images/noImg.png'
import { paths } from '../../routes/path'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import moment from 'moment/moment'

function OrderDetail() {
  const { generalData } = useSelector(generalDataSelector)
  const tableHeader = [
    {
      key: 'Items name',
      value: 'item_name',
      sorting: false,
      clickable: false,
      cell: ({ item }) => {
        return (
          <div className='flex items-center gap-5'>
            <img
              src={item?.item_image ? item?.item_image : noImage}
              alt='product-img'
              className='w-10 h-10 flex-shrink-0'
            />
            <p>
              <span className='block'>{item?.item_name ?? '--'}</span>

              {item?.unit_size && (
                <span className='block text-xs text-dark-grey'>{`${item?.unit_size ?? '-'} ${item?.unit_of_measure?.name ?? '-'}`}</span>
              )}
            </p>
          </div>
        )
      },
    },
    {
      key: 'Unit price',
      value: 'item.cost_price',
      sorting: false,
      clickable: false,
      cell: ({ item }) => {
        return <>{item?.cost_price && <span>{`${generalData?.currency ?? ''} ${item?.cost_price ?? '--'}`}</span>}</>
      },
    },
    {
      key: 'Quantity',
      value: 'total_qty',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Total price',
      value: 'total_amount',
      sorting: false,
      clickable: false,
      cell: ({ total_amount }) => {
        return <>{total_amount && <span>{`${generalData?.currency ?? ''} ${total_amount ?? '--'}`}</span>}</>
      },
    },
  ]
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { unique_order_id, orderId } = useParams()
  const [orderDetail, setOrderDetail] = useState({}) //order detail

  //pagination of items
  const itemsPerPage = 10
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    if (orderId && unique_order_id) {
      getOrderDetailById(orderId, unique_order_id)
    }
  }, [orderId, unique_order_id])

  const getOrderDetailById = async (orderId, unique_order_id) => {
    dispatch(showLoader())
    const response = await GetOrderDetailById(orderId, unique_order_id)
    if (response?.status === 200) {
      setOrderDetail(response?.data?.data)
      const results = response?.data?.data
      setCurrentItems(results)
      setPageCount(Math.ceil(1 / itemsPerPage))
      setTotalCount(1)
    }
    dispatch(hideLoader())
  }

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage
    setItemOffset(newOffset)
  }

  return (
    <WhiteCard className={'w-full'}>
      <div className='grid xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-3 sm:mb-4 mb-3'>
        <div className=''>
          <div className='bg-site-red/5 px-5 py-5 rounded-lg h-full'>
            <Paragraph text14 className={'mb-3'}>
              Order date
            </Paragraph>
            <Paragraph text16 className={'font-bold'}>
              {orderDetail?.[0]?.created_at && (
                <span>{moment.utc(orderDetail?.[0]?.created_at).local().format('h:mm A DD.MM.YYYY')}</span>
              )}
            </Paragraph>
          </div>
        </div>
        <div className=''>
          <div className='bg-primary-blue/5 px-5 py-5 rounded-lg h-full'>
            <Paragraph text14 className={'mb-3'}>
              Employee name
            </Paragraph>
            <Paragraph text16 className={'font-bold'}>
              {orderDetail?.[0]?.created_by?.full_name ?? '-'}
            </Paragraph>
          </div>
        </div>
        <div className=''>
          <div className='bg-site-green/5 px-5 py-5 rounded-lg h-full'>
            <Paragraph text14 className={'mb-3'}>
              Value
            </Paragraph>
            <Paragraph text16 className={'font-bold'}>
              {generalData?.currency ?? ''} {orderDetail?.[0]?.total_all_amount?.toFixed(2) ?? 0}
            </Paragraph>
          </div>
        </div>
        <div className=''>
          <div className='bg-site-yellow/5 px-5 py-5 rounded-lg h-full'>
            <Paragraph text14 className={'mb-3'}>
              Suppliers
            </Paragraph>
            <Paragraph text16 className={'font-bold'}>
              {orderDetail?.[0]?.supplier?.supplier_name ?? '-'}
            </Paragraph>
          </div>
        </div>
        <div className='xl:col-span-1 sm:col-span-2'>
          <div className='bg-site-red/5 px-5 py-4 rounded-lg sm:text-center '>
            <Paragraph text14 className={'mb-3'}>
              Status
            </Paragraph>
            <Paragraph
              text14
              className={`${orderDetail?.[0]?.status?.status_name === 'DELIVERED' ? 'bg-site-green/5 text-site-green' : 'text-site-red bg-site-red/5'}  py-[6px] px-3 rounded-lg inline-block`}
            >
              {orderDetail?.[0]?.status?.status_name ?? '-'}
            </Paragraph>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-12 sm:gap-4 gap-3 items-center'>
        <div className='col-span-12'>
          <Paragraph text20 className={'mb-3'}>
            Products
          </Paragraph>
          <TableLayout
            totalCount={totalCount}
            tableHeader={tableHeader}
            currentItems={currentItems}
            isEdit={false}
            isDelete={false}
            isView={false}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            itemOffset={itemOffset}
            itemsPerPage={itemsPerPage}
          />
        </div>
        <div className='md:col-span-6 col-span-12'>
          <div className='bg-light-grey p-4 rounded-2xl flex items-center justify-between gap-3 '>
            <Paragraph text18 className={'font-bold'}>
              Quantity
            </Paragraph>
            <Paragraph text18 className={'font-bold'}>
              {orderDetail?.[0]?.total_all_qty ?? 0}
            </Paragraph>
          </div>
        </div>
        <div className='md:col-span-6 col-span-12'>
          <div className='bg-light-grey p-4 rounded-2xl flex items-center justify-between gap-3 '>
            <Paragraph text18 className={'font-bold'}>
              Total
            </Paragraph>
            <Paragraph text18 className={'font-bold'}>
              {generalData?.currency ?? ''} {orderDetail?.[0]?.total_all_amount?.toFixed(2) ?? 0}
            </Paragraph>
          </div>
        </div>
        <div className='col-span-12'>
          <div className='flex items-center flex-wrap justify-end gap-4 mt-2'>
            <Button secondary className={'sm:w-auto w-full'} onClick={() => navigate(paths?.owner?.historyOrders)}>
              Cancel
            </Button>
            <Button
              primary
              className={'sm:w-auto w-full'}
              onClick={() => navigate(`${paths?.owner?.orderReceipt}/${unique_order_id}/${orderId}`)}
            >
              Order receipt
            </Button>
          </div>
        </div>
      </div>
    </WhiteCard>
  )
}

export default OrderDetail
