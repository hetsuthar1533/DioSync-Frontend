import React, { useEffect, useState } from 'react'
import WhiteCard from '../../../components/themeComponents/WhiteCard'
import Paragraph from '../../../components/core/typography/Paragraph'
import Button from '../../../components/core/formComponents/Button'
import { useSelector } from 'react-redux'
import { activeVenueSelector } from '../../../redux/slices/ownerVenueSlice'
import { GetMySubscriptionDetails } from '../../../services/mySubscriptionService'
import { CancelMySubscription } from '../../../services/mySubscriptionService'
import { generalDataSelector } from '../../../redux/slices/generalDataSlice'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../../routes/path'

function MySubscription() {
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const [subscriptionDetails, setSubscriptionDetails] = useState()
  let navigate = useNavigate()
  useEffect(() => {
    if (activeVenue && activeVenue > 0) {
      getMySubscription(activeVenue)
    }
  }, [activeVenue])

  useEffect(() => {
    document.title = `My subscription- DioSync`
  }, [])

  const getMySubscription = async (activeVenue) => {
    const queryString = `?bar_vanue_id=${activeVenue}`
    const response = await GetMySubscriptionDetails(queryString)
    if (response?.status === 200) {
      setSubscriptionDetails(response.data?.data)
    }
  }

  const handleCancelSubscription = async () => {
    const response = await CancelMySubscription(activeVenue)
    if (response?.status === 200) {
      getMySubscription(activeVenue)
    }
    navigate(paths.owner.dashboard)
  }
  return (
    <WhiteCard>
      <div className='flex items-center flex-wrap gap-4'>
        <div className='border border-medium-grey py-4 px-[30px] rounded-lg sm:w-auto w-full'>
          <Paragraph text14 className={'!font-normal pb-[2px] border-b border-medium-grey'}>
            ID number
          </Paragraph>
          <Paragraph text14 className={'pt-1'}>
            {subscriptionDetails?.id_number ?? 0}
          </Paragraph>
        </div>
        <div className='border border-medium-grey py-4 px-[30px] rounded-lg sm:w-auto w-full'>
          <Paragraph text14 className={'!font-normal pb-[2px] border-b border-medium-grey'}>
            Date of subscription
          </Paragraph>
          <Paragraph text14 className={'pt-1'}>
            {subscriptionDetails?.Date_of_subscription ?? '-'}
          </Paragraph>
        </div>
        <div className='border border-medium-grey py-4 px-[30px] rounded-lg sm:w-auto w-full'>
          <Paragraph text14 className={'!font-normal pb-[2px] border-b border-medium-grey'}>
            Plan name
          </Paragraph>
          <Paragraph text14 className={'pt-1'}>
            {subscriptionDetails?.plan_name ?? '-'}
          </Paragraph>
        </div>
        <div className='border border-medium-grey py-4 px-[30px] rounded-lg sm:w-auto w-full'>
          <Paragraph text14 className={'!font-normal pb-[2px] border-b border-medium-grey'}>
            Validity
          </Paragraph>
          <Paragraph text14 className={'pt-1'}>
            {subscriptionDetails?.validity ?? '-'}
          </Paragraph>
        </div>
        <div className='border border-medium-grey py-4 px-[30px] rounded-lg sm:w-auto w-full'>
          <Paragraph text14 className={'!font-normal pb-[2px] border-b border-medium-grey'}>
            Plan price - Monthly
          </Paragraph>
          <Paragraph text14 className={'pt-1'}>
            {generalData?.currency ?? ''} {subscriptionDetails?.plan_price_monthly ?? '-'}
          </Paragraph>
        </div>
      </div>
      {/* <div className='text-right'>
        <Button lightBlueBg className={'mt-10'} onClick={handleCancelSubscription}>
          Cancel subscription
        </Button>
      </div> */}
    </WhiteCard>
  )
}

export default MySubscription
