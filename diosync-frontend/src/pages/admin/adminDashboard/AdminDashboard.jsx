
import React, { useEffect, useState } from 'react'
import DashboardStatCard from '../../../components/themeComponents/DashboardStatCard'
import { GetDashboardDetails } from '../../../services/dashboardService'
import { getAllContact, GetItems } from '../../../services/itemsService'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../../routes/path'
import PieChart from '../../../components/themeComponents/PieChart'
import LineChart from '../../../components/themeComponents/LineChart'

function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [dashboardData, setDashboardData] = useState({})
  const [categoryLength, setCategoryLength] = useState(0)
  const [subcategoryLength, setSubCategoryLength] = useState(0)
  const [activeItem, setActiveItem] = useState(0)
  const [pieChartData, setPieChartData] = useState([])
const [LineChartData,setLineChartData]=useState([])
  useEffect(() => {
    getDashboardDetails()
    getItemsData()
  }, [])

  const getDashboardDetails = async () => {
    dispatch(showLoader())
    try {
      const response = await GetDashboardDetails()
      // console.log("i am response from getdashboard detail ",response);
      
      if (response?.data?.status) {
        setDashboardData(response?.data?.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      dispatch(hideLoader())
    }
  }

  const getItemsData = async () => {
    dispatch(showLoader())
    try {
      const response = await GetItems()
      const contact=await getAllContact()
      const items = response?.data?.data || []
const contactData=contact?.data?.data||[]
const contactMap = new Map()

// console.log("hi i am contact data",contactData);
contactData.forEach((contact)=>{
  // console.log(contact);
  // console.log(typeof(contact.inquiry_date));
  
  let newDate=contact.inquiry_date?.split("T")[0]
  // console.log(newDate);
  
  if(!contactMap.has(newDate))
  contactMap.set(newDate,0)

  contactMap.set(newDate, contactMap.get(newDate) + (contact.contact_count || 0))

})
// console.log(contactMap);

      const categorySet = new Set()
      const subcategorySet = new Set()
      let activeCount = 0
      const itemMap = new Map()

      items.forEach((item) => {
        if (item.Category) categorySet.add(item.Category)
        if (item.Subcategory) subcategorySet.add(item.Subcategory)
        if (item.status) activeCount++

        if (item.ItemName) {
          if (!itemMap.has(item.ItemName)) {
            itemMap.set(item.ItemName, 0)
          }
          itemMap.set(item.ItemName, itemMap.get(item.ItemName) + (item.unitSize || 0))
        }
      })

      setCategoryLength(categorySet.size)
      setSubCategoryLength(subcategorySet.size)
      setActiveItem(activeCount)

      const chartData = Array.from(itemMap.entries()).map(([name, size]) => ({
        name,
        size,
      }))
      // console.log(chartData);
      
const LineChartData1=Array.from((contactMap.entries())).map(([date, count]) => ({
  date,
  count,
}))
// console.log(LineChartData1);

      setPieChartData(chartData)
      setLineChartData(LineChartData1)
      // console.log(LineChartData);
      
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      dispatch(hideLoader())
    }
  }

  return (
    <div className="grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3">
      <div className="col-span-12 xl:col-span-4 md:col-span-6" onClick={() => navigate(paths?.admin?.barowner)}>
        <DashboardStatCard
          className="bg-[#f2f5fd]"
          statValue={categoryLength}
          statName="Categories"
          expandableBG="bg-[#f2f5fd]"
        />
      </div>
      <div className="col-span-12 xl:col-span-4 md:col-span-6" onClick={() => navigate(paths?.admin?.contactInquiry)}>
        <DashboardStatCard
          className="bg-[#F2FBF3]"
          statValue={subcategoryLength}
          statName="SubCategories"
          expandableBG="bg-[#F2FBF3]"
        />
      </div>
      <div className="col-span-12 xl:col-span-4 md:col-span-6" onClick={() => navigate(paths?.admin?.subscriptionInquiry)}>
        <DashboardStatCard
          className="bg-[#fcf8f3]"
          statValue={activeItem}
          statName="Number of Active Item"
          expandableBG="bg-[#fcf8f3]"
        />
      </div>
      <div className='flex sm:flex-col md:flex-row '>

      <div className="col-span-12">
      
        <PieChart data={pieChartData} />
      </div>

<div className='flex-1 p-4  sm:w-[60vh] sm:pt-[55vh]  md:pt-[2vh]'>
        <LineChart data1={LineChartData} />
       </div>
   </div>
    </div>
  )
}

export default AdminDashboard
