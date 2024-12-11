/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Paragraph from '../../components/core/typography/Paragraph'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import ListItem from '../../components/themeComponents/ListItem'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Button from '../../components/core/formComponents/Button'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { useSelector, useDispatch } from 'react-redux'
import { GetCartOrderSummary, GetCartOrderSupplier, SendSingleOrder } from '../../services/cartService'
import noImage from '../../assets/images/noImg.png'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/path'
import { setSupplierData, updateEmailContent, updateEmailSubject } from '../../redux/slices/cartSupplierSlice'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

import Modal from '../../components/core/Modal'
import SendOrder from './SendOrder'

function ReviewCart({ setShowButton, handleChangeCurrentStep }) {
  const { generalData } = useSelector(generalDataSelector)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const activeVenue = useSelector(activeVenueSelector)
  const supplierData = useSelector((state) => state?.cartSupplier?.suppliers)
  const [orderSummaryData, setOrderSummaryData] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const [sendOrderSupplierData, setSendOrderSupplierData] = useState(null)

  useEffect(() => {
    if (activeVenue > 0) {
      getOrderSummary()
      getSummarySupplierData()
    }
  }, [activeVenue])

  const getOrderSummary = async () => {
    if (activeVenue > 0) {
      const response = await GetCartOrderSummary(activeVenue)
      if (response?.status === 200) {
        setOrderSummaryData?.(response?.data?.data)
      }
    }
  }

  const getSummarySupplierData = async () => {
    if (activeVenue > 0) {
      const response = await GetCartOrderSupplier(activeVenue)
      if (response?.status === 200) {
        dispatch(setSupplierData(response?.data?.data)) // Store supplier data in Redux
        if (response?.data?.data?.length > 0) {
          setShowButton(true)
        } else {
          setShowButton(false)
          handleChangeCurrentStep(0)
        }
      }
    }
  }

  // Handle subject change and store it in Redux
  const handleSubjectChange = (supplierId, value) => {
    dispatch(updateEmailSubject({ supplierId, subject: value }))
  }

  // Handle content change and store it in Redux
  const handleContentChange = (supplierId, value) => {
    dispatch(updateEmailContent({ supplierId, content: value }))
  }

  const closePopup = () => {
    setShowPopup(false)
  }
  const handleSendOrderCallback = () => {
    getOrderSummary()
    getSummarySupplierData()
  }

  return (
    <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3 w-full mt-6'>
      <div className='col-span-12'>
        <Paragraph text20>Order Summary</Paragraph>
      </div>
      <div className='xxl:col-span-8 xl:col-span-7 md:col-span-6 col-span-12'>
        <WhiteCard p20 className={'w-full sticky top-[96px]'}>
          {orderSummaryData?.items?.map((itemdata, index) => {
            const isLastItem = index === orderSummaryData?.items?.length - 1
            return (
              <ListItem
                key={index}
                {...(!isLastItem && { borderBottom: true })}
                defaultItem
                withCount
                className='mb-2 !px-0 !items-center'
                itemName={itemdata?.item?.item_name}
                productImage={itemdata?.item?.item_image ?? noImage}
                currency={`${generalData?.currency ?? ''}`}
                price={itemdata?.total_cost?.toFixed(2)}
                qty={itemdata?.total_each_item_qty}
                imgSize={'42px'}
                fontSize={'md:text-lg sm:text-base text-sm'}
              />
            )
          })}
          <ul className='bg-light-grey p-4 rounded-2xl'>
            <li className='flex items-center justify-between gap-3 mb-5'>
              <Paragraph text18 className={'font-bold'}>
                Number of Items
              </Paragraph>
              <Paragraph text18 className={'font-bold'}>
                {orderSummaryData?.total_qty ?? 0}
              </Paragraph>
            </li>
            <li className='flex items-center justify-between gap-3 mb-5'>
              <Paragraph text18 className={'font-bold'}>
                Total
              </Paragraph>
              <Paragraph text18 className={'font-bold'}>
                {generalData?.currency ?? ''} {orderSummaryData?.total_amount ?? 0}
              </Paragraph>
            </li>
            <li className='flex items-center justify-between gap-3'>
              <Paragraph text18 className={'font-bold'}>
                Supplier
              </Paragraph>
              <Paragraph text18 className={'font-bold'}>
                {orderSummaryData?.total_suppliers ?? 0}
              </Paragraph>
            </li>
          </ul>
        </WhiteCard>
      </div>

      <div className='xxl:col-span-4 xl:col-span-5 md:col-span-6 col-span-12'>
        {supplierData?.length > 0 &&
          supplierData?.map((supplier) => (
            <WhiteCard key={supplier?.id} p20 className={'lg:mb-6 sm:mb-4 mb-3'}>
              <Paragraph text20>{supplier?.supplier_name}</Paragraph>
              <ul className='flex flex-wrap items-center justify-start gap-[7px] mt-4'>
                <li className='flex items-center justify-start gap-2 bg-light-grey rounded-lg py-1 px-3'>
                  <Paragraph text14 className={'text-dark-grey !font-normal'}>
                    Qty
                  </Paragraph>
                  <Paragraph text14 className={'font-semibold'}>
                    {supplier?.total_qty_all_item ?? 0}
                  </Paragraph>
                </li>
                <li className='flex items-center justify-start gap-2 bg-light-grey rounded-lg py-1 px-3'>
                  <Paragraph text14 className={'text-dark-grey !font-normal'}>
                    Min. Order
                  </Paragraph>
                  <Paragraph text14 className={''}>
                    {supplier?.min_order + ` ${generalData?.currency ?? ''}` ?? 0}
                  </Paragraph>
                </li>
                <li className='flex items-center justify-start gap-2 bg-light-grey rounded-lg py-1 px-3'>
                  <Paragraph text14 className={'text-dark-grey !font-normal'}>
                    Total
                  </Paragraph>
                  <Paragraph text14 className={''}>
                    {supplier?.total_price_all_item?.toFixed(2) + ` ${generalData?.currency ?? ''}` ?? 0}
                  </Paragraph>
                </li>
              </ul>
              <div className='border-medium-grey border rounded-lg p-3 mt-3'>
                <div className='bg-light-grey rounded-[6px] px-3 py-[7px]'>
                  <Paragraph text14 className={'text-dark-grey !font-bold'}>
                    SUBJECT
                  </Paragraph>
                  <input
                    className='w-full'
                    value={supplier?.email_template?.subject || ''}
                    onChange={(e) => handleSubjectChange(supplier?.id, e?.target?.value)}
                  />
                </div>
                <ReactQuill
                  theme='snow'
                  value={
                    supplier?.email_template?.content ||
                    'I hope this email finds you well. I am writing to place an order for the following items:'
                  }
                  onChange={(value) => handleContentChange(supplier?.id, value)}
                  placeholder='I hope this email finds you well. I am writing to place an order for the following items:'
                  className='px-0 mt-2'
                />
              </div>
              <Button
                primary
                className={'w-full mt-5'}
                onClick={() => {
                  setSendOrderSupplierData(supplier)
                  setShowPopup(true)
                }}

                // onClick={() => {
                //   handleSubmitSendOrder(supplier)
                // }}
              >
                Send order
              </Button>
            </WhiteCard>
          ))}
      </div>
      <Modal open={showPopup} header headingText={'Send Order'} onClose={closePopup} width={'md:w-[660px]'}>
        <SendOrder
          onClose={closePopup}
          handleChangeCurrentStep={handleChangeCurrentStep}
          supplier={sendOrderSupplierData}
          handleSendOrderCallback={handleSendOrderCallback}
        />
      </Modal>
    </div>
  )
}

export default ReviewCart
