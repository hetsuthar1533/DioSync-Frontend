import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCheck } from 'react-icons/fa'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'
import Paragraph from '../../components/core/typography/Paragraph'
import Button from '../../components/core/formComponents/Button'
import Modal from '../../components/core/Modal'
import IconCart from '../../assets/images/icon_cart_check_green.svg'
import { userSelector } from '../../redux/slices/userSlice'
import { userRoles } from '../../constants/roleConstants'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/path'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { v4 as uuidv4 } from 'uuid'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { SendSingleOrder } from '../../services/cartService'

const SendOrder = ({ onClose, handleChangeCurrentStep, supplier, handleSendOrderCallback }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const activeVenue = useSelector(activeVenueSelector)
  const { generalData } = useSelector(generalDataSelector)
  const { user_type } = useSelector(userSelector)
  const [open, setOpen] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const handleBackToHome = () => {
    if (user_type === userRoles?.Owner) {
      navigate(paths.owner.dashboard)
    } else {
      navigate(paths.manager.dashboard)
    }
  }

  useEffect(() => {
    if (supplier?.total_price_all_item >= Number(supplier?.min_order)) {
      setIsValid(true)
    }
  }, [supplier])

  const handleSubmitSendOrder = async () => {
    dispatch(showLoader())
    const uniqueId = uuidv4()
    if (activeVenue && supplier) {
      const data = {
        bar_venue: activeVenue,
        item: supplier?.item[0]?.id,
        supplier: supplier?.id,
        total_qty: supplier?.total_qty_all_item,
        total_amount: supplier?.total_price_all_item,
        email_subject: supplier?.email_template?.subject, // Use updated subject from Redux
        email_content: supplier?.email_template?.content, // Use updated content from Redux
        // added after changes
        item_qty: supplier?.item[0].item_total_qty,
        item_amount: supplier?.item[0].item_total_price,
        unique_order_id: uniqueId,
      }
      const response = await SendSingleOrder(data)
      if (response?.status === 200) {
        setOpen(true)
      }
    }
    dispatch(hideLoader())
  }

  return (
    <div>
      <Paragraph text16 className={'mb-6'}>
        Some order(s) have not reached the minimum orders required. Adjust your order(s) to meet the minimum
        requirements to proceed with the concerned suppliers.
      </Paragraph>
      <Paragraph text14 className={'!font-normal mb-5'}>
        "Fill the min. Order" allows reaching automatically the minimum order required by the supplier, based on the
        references that are closest to their restocking thresholds.
      </Paragraph>

      <div>
        <Paragraph text20 className={'mb-5'}>
          {supplier?.supplier_name}
        </Paragraph>
        <ul className='flex flex-wrap items-center md:justify-between gap-[7px] mt-4'>
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
              {supplier?.min_order ?? 0}
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
          {supplier?.total_price_all_item < supplier?.min_order && (
            <li className='flex items-center justify-start gap-2 bg-light-grey rounded-lg py-1 px-3'>
              <Paragraph text14 className={'text-dark-grey !font-normal'}>
                Missing
              </Paragraph>
              <Paragraph text14 className={''}>
                {`${supplier?.min_order - supplier?.total_price_all_item?.toFixed(2)} ${generalData?.currency ?? ''}`}
              </Paragraph>
            </li>
          )}
        </ul>
        <div className='flex items-center my-4 gap-[10px] sm:flex-nowrap flex-wrap'>
          <Button primary className={'w-full'}>
            Your cart
          </Button>

          {supplier?.total_price_all_item >= supplier?.min_order ? (
            <Button secondary disabled className={'w-full !bg-white'}>
              <img src={IconCart} alt='icon-cart' />
            </Button>
          ) : (
            //need to add here
            <Button
              secondary
              className={'w-full'}
              onClick={() => {
                onClose()
                handleChangeCurrentStep(0)
              }}
            >
              Fill the Min. order
            </Button>
          )}
        </div>
      </div>

      {isValid && (
        <div className='text-end pt-1'>
          <Button primary className={'sm:w-auto w-full'} onClick={handleSubmitSendOrder}>
            Confirm
          </Button>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} width={'w-[496px]'}>
        <div className='flex items-center justify-center flex-col'>
          <FaCheck color='#00A511' size={102} />
          <Paragraph text16 className={'font-semibold md:mb-8 mb-6'}>
            All your orders have been sent successfully
          </Paragraph>
          <div className='flex items-center justify-center gap-4'>
            <Button
              secondary
              onClick={() => {
                setOpen(false)
                handleBackToHome()
              }}
            >
              Back to home
            </Button>
            <Button
              lightBlueBg
              onClick={() => {
                setOpen(false)
                onClose()
                handleChangeCurrentStep(0)
              }}
            >
              New order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SendOrder
