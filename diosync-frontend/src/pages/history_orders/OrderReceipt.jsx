/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import Button from '../../components/core/formComponents/Button'
import { FiPrinter, FiUpload } from 'react-icons/fi'
import TableLayout from '../../components/themeComponents/TableLayout'
import noImage from '../../assets/images/noImg.png'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { GetOrderDetailById } from '../../services/historyService'
import { PDFDownloadLink } from '@react-pdf/renderer'
import OrderReceiptPDF from './OrderReceiptPDF'
import { useReactToPrint } from 'react-to-print'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function OrderReceipt() {
  const { generalData } = useSelector(generalDataSelector)
  const tableHeader = [
    {
      key: 'Order id',
      value: 'id',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Items name',
      value: 'item_name',
      sorting: false,
      clickable: false,
      cell: ({ item }) => {
        return (
          <div className='flex items-center gap-5 justify-center'>
            <img
              src={item?.item_image ? item?.item_image : noImage}
              alt='product-img'
              className='w-10 h-10 flex-shrink-0'
            />
            <p className='text-left'>
              <span className='block'>{item?.item_name ?? '--'}</span>

              {item?.unit_size && (
                <span className='block text-xs text-dark-grey'>{`${item?.unit_size ?? '-'} ${item?.unit_of_measure?.name ?? '-'}`}</span>
              )}
            </p>
          </div>
        )
      },
    },
    // {
    //   key: 'Unit price',
    //   value: 'item.cost_price',
    //   sorting: false,
    //   clickable: false,
    // },
    {
      key: 'Quantity',
      value: 'total_all_qty',
      sorting: false,
      clickable: false,
    },
    {
      key: 'Total price',
      value: 'total_amount',
      sorting: false,
      clickable: false,
      cell: ({ total_amount }) => {
        return (
          <>
            {total_amount && (
              <span>{`${generalData?.currency ?? ''} ${Number(total_amount)?.toFixed(2) ?? '--'}`}</span>
            )}
          </>
        )
      },
    },
    {
      key: 'Suppliers',
      value: 'supplier.supplier_name',
      sorting: false,
      clickable: false,
    },
  ]

  const dispatch = useDispatch()
  const { unique_order_id, orderId } = useParams()
  const componentRef = useRef()

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
      const results = response?.data?.data || []
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
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // Specify the component to print
    documentTitle: 'Printed Content',
  })

  return (
    <WhiteCard>
      <div className='flex items-center gap-[10px] sm:justify-end justify-center sm:flex-nowrap flex-wrap mb-4'>
        <PDFDownloadLink
          document={<OrderReceiptPDF items={currentItems} currentCurrency={generalData?.currency ?? ''} />}
          fileName='order_receipt.pdf'
        >
          {({ loading }) =>
            loading ? (
              <Button secondary>
                <FiUpload fontSize={'20px'} />
                Generating PDF...
              </Button>
            ) : (
              <Button secondary>
                <FiUpload fontSize={'20px'} />
                Export PDF
              </Button>
            )
          }
        </PDFDownloadLink>

        <Button primary onClick={handlePrint}>
          <FiPrinter />
          Print
        </Button>
      </div>
      <div ref={componentRef}>
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
    </WhiteCard>
  )
}

export default OrderReceipt
