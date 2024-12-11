import React, { useEffect, useState } from 'react'
import DashboardStatCard from '../../../components/themeComponents/DashboardStatCard'
import { GetDashboardDetails } from '../../../services/dashboardService'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../../routes/path'

function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [dashboardData, setDashboardData] = useState({})
  useEffect(() => {
    getDashboardDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getDashboardDetails = async () => {
    dispatch(showLoader())
    const resposne = await GetDashboardDetails()
    if (resposne?.data?.status) {
      setDashboardData(resposne?.data?.data)
    }
    dispatch(hideLoader())
  }

  return (
    <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3'>
      <div className='col-span-12 xl:col-span-4 md:col-span-6' onClick={() => navigate(paths?.admin?.barowner)}>
        <DashboardStatCard
          className={'bg-[#f2f5fd]'}
          statValue={dashboardData?.subscriber_count ?? 0}
          statName={'Number of subscribers'}
          expandableBG={'bg-[#f2f5fd]'}
        />
      </div>
      <div className='col-span-12 xl:col-span-4 md:col-span-6' onClick={() => navigate(paths?.admin?.contactInquiry)}>
        <DashboardStatCard
          className={'bg-[#F2FBF3]'}
          statValue={dashboardData?.contact_us_count ?? 0}
          statName={'Number of contact us inquiries'}
          expandableBG={'bg-[#F2FBF3]'}
        />
      </div>
      <div
        className='col-span-12 xl:col-span-4 md:col-span-6'
        onClick={() => navigate(paths?.admin?.subscriptionInquiry)}
      >
        <DashboardStatCard
          className={'bg-[#fcf8f3]'}
          statValue={dashboardData?.inquiries_count ?? 0}
          statName={'Number of subscription inquiries'}
          expandableBG={'bg-[#fcf8f3]'}
        />
      </div>
    </div>
  )
}

export default AdminDashboard
