// // import React, { useEffect, useState } from 'react'
// // import DashboardStatCard from '../../../components/themeComponents/DashboardStatCard'
// // import { GetDashboardDetails } from '../../../services/dashboardService'
// // import { useDispatch } from 'react-redux'
// // import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'
// // import { useNavigate } from 'react-router-dom'
// // import { paths } from '../../../routes/path'
// // import { useSelector } from 'react-redux'
// // import WhiteCard from '../../../components/themeComponents/WhiteCard'
// // import Paragraph from '../../../components/core/typography/Paragraph'
// // import ApexCharts from 'react-apexcharts';
// // import LineChart from '../../../components/themeComponents/LineChart'
// // import PieChart from '../../../components/themeComponents/PieChart'

// // function AdminDashboard() {
// //   const navigate = useNavigate()
// //   const dispatch = useDispatch()
// //   const data=useSelector((state)=>(state.Item?.item?.data?.data))
// //   const [trustIndicatorData, setTrustIndicatorData] = useState(0)

// //   const [dashboardData, setDashboardData] = useState({})
// //   useEffect(() => {
// //     getDashboardDetails()
// //     // dashboardData1()
// //     console.log("hi i am data from item redux state",data);
    
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [])

// //   const getDashboardDetails = async () => {
// //     dispatch(showLoader())



// //     const resposne = await GetDashboardDetails()
// //     if (resposne?.data?.status) {
// //       setDashboardData(resposne?.data?.data)
// //     }
// //     dispatch(hideLoader())
// //   }

// //   const trustIndicator = {
// //     options: {
// //       chart: {
// //         height: '180',
// //         type: 'radialBar',
// //       },
// //       colors: ['#00A511'],
// //       plotOptions: {
// //         radialBar: {
// //           hollow: {
// //             margin: 0,
// //             size: '50%',
// //           },
// //           dataLabels: {
// //             showOn: 'always',
// //             name: {
// //               show: false, // Hide the label
// //             },
// //             value: {
// //               color: '#00A511',
// //               fontSize: '24px',
// //               show: true,
// //               offsetY: 8,
// //             },
// //           },
// //           track: {
// //             background: 'rgba(0, 165, 17, .1)', // Set the background color of the track (the outer circle)
// //             strokeWidth: '100%',
// //           },
// //         },
// //       },
// //       stroke: {
// //         lineCap: 'round',
// //         fill: '#00A511',
// //       },
// //       responsive: [
// //         {
// //           breakpoint: 3600,
// //           options: {
// //             chart: {
// //               height: 180,
// //             },
// //           },
// //         },
// //         {
// //           breakpoint: 1440,
// //           options: {
// //             chart: {
// //               height: 160,
// //             },
// //           },
// //         },
// //         {
// //           breakpoint: 576, // Add a separate breakpoint for 575
// //           options: {
// //             chart: {
// //               height: 160,
// //             },
// //           },
// //         },
// //       ],
// //     },
// //     series: [trustIndicatorData ?? 0],
// //   }
// //   function dashboardData1(){
// //     for(let i of data)
// //     {
// //       console.log(i)
// //     }
// //   }
// //   return (
// //     <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3'>
// //       <div className='col-span-12 xl:col-span-4 md:col-span-6' onClick={() => navigate(paths?.admin?.barowner)}>
// //         <DashboardStatCard
// //           className={'bg-[#f2f5fd]'}
// //           statValue={dashboardData?.subscriber_count ?? 0}
// //           statName={'Categories'}
// //           expandableBG={'bg-[#f2f5fd]'}
// //         />
// //       </div>
// //       <div className='col-span-12 xl:col-span-4 md:col-span-6' onClick={() => navigate(paths?.admin?.contactInquiry)}>
// //         <DashboardStatCard
// //           className={'bg-[#F2FBF3]'}
// //           statValue={dashboardData?.contact_us_count ?? 0}
// //           statName={'SubCategories'}
// //           expandableBG={'bg-[#F2FBF3]'}
// //         />
// //       </div>
// //       <div
// //         className='col-span-12 xl:col-span-4 md:col-span-6'
// //         onClick={() => navigate(paths?.admin?.subscriptionInquiry)}
// //       >
// //         <DashboardStatCard
// //           className={'bg-[#fcf8f3]'}
// //           statValue={dashboardData?.inquiries_count ?? 0}
// //           statName={'Number of Active Item'}
// //           expandableBG={'bg-[#fcf8f3]'}
// //         />
// //       </div>
// //       <div className='flex sm:flex-col md:flex-row '>
// //       <div className='flex-1 p-4  '>
// //         <PieChart/>
// //       </div>
     
// //    <div className='flex-1 p-4'>
// // <LineChart/>    </div>

// //     </div>
   
// //     </div>
// //   )
// // }

// // export default AdminDashboard
// import React, { useEffect, useState } from 'react'
// import DashboardStatCard from '../../../components/themeComponents/DashboardStatCard'
// import { GetDashboardDetails } from '../../../services/dashboardService'
// import { useDispatch } from 'react-redux'
// import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'
// import { useNavigate } from 'react-router-dom'
// import { paths } from '../../../routes/path'
// import { useSelector } from 'react-redux'
// import WhiteCard from '../../../components/themeComponents/WhiteCard'
// import Paragraph from '../../../components/core/typography/Paragraph'
// import ApexCharts from 'react-apexcharts'
// import LineChart from '../../../components/themeComponents/LineChart'
// import PieChart from '../../../components/themeComponents/PieChart'
// import { ItemData } from '../../../redux/slices/ItemSlice'
// import { GetItems } from '../../../services/itemsService'

// function AdminDashboard() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const data = useSelector((state) => state.Item?.item?.data?.data)
  
//   const [trustIndicatorData, setTrustIndicatorData] = useState(0)
//   const [dashboardData, setDashboardData] = useState({})
//   const [currentItems, setCurrentItems] = useState([])

//   const category=[]
// const subcategory=[]
// const items=[]
// const units=[]
// const [categoryLength,setCategorylength]=useState(0)  
// const [subcategoryLength,setSubCategorylength]=useState(0)  
// const [activeItem,setActiveItem]=useState(0)
// useEffect(() => {
//     getDashboardDetails()
//     getItemsData()
//     console.log("Data from Redux state:", data)
//   }, [])

//   const getDashboardDetails = async () => {
//     dispatch(showLoader())

//     try {
//       const response = await GetDashboardDetails()
//       if (response?.data?.status) {
//         setDashboardData(response?.data?.data)
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error)
//     } finally {
//       dispatch(hideLoader())
//     }
//   }
//     const getItemsData = async () => {
//     console.log("hi this is getItemsDATA method and i am inside Item Listing componenent");
    
//     dispatch(showLoader())
//     let queryString = ``
    
//     const response = await GetItems(queryString)
//     console.log("this is response ",response);


//     const results = response?.data?.data || []
//     console.log("Hello I came from axios middleware",results)
//     const count = response?.data?.data?.count || 0
//     setCurrentItems(results)
//     console.log("hi i am cuureent item ")
//     dispatch(ItemData(response))
//     let count1=0

// for (let i of response?.data?.data)
// {
//   console.log("this is current item",i)
//   console.log("i am category",i.Category);
//   if(!category.includes(i.Category)){
//     category.push(i.Category)
//   }

// if(!subcategory.includes(i.Subcategory))
// {
//   subcategory.push(i.Subcategory)
// }  
// if(i.ItemName){
//   console.log("i am itemname inside new if of");
  
//   items.push(i.ItemName)
// }
// if(i.unitSize)
// {
//   units.push(i.unitSize)
// }
// if(i.status)
// {
// count1+=1
// console.log(count1,"hello i am count")
// }
// setActiveItem(count1)
// }

// console.log("this is me hi i am category ",category)
// console.log("this is me hi i am category length ",category.length)
// setCategorylength(category.length)  
// setSubCategorylength(subcategory.length)
// console.log("this is me hi i am subcategory",subcategory);
// console.log("hello i am items ",items,"");

//     dispatch(hideLoader())
//   }

  

//   return (
//     <div className='grid grid-cols-12 lg:gap-6 sm:gap-4 gap-3'>
//       <div className='col-span-12 xl:col-span-4 md:col-span-6' onClick={() => navigate(paths?.admin?.barowner)}>
//         <DashboardStatCard
//           className={'bg-[#f2f5fd]'}
//           statValue={categoryLength}
//           statName={'Categories'}
//           expandableBG={'bg-[#f2f5fd]'}
//         />
//       </div>
//       <div className='col-span-12 xl:col-span-4 md:col-span-6' onClick={() => navigate(paths?.admin?.contactInquiry)}>
//         <DashboardStatCard
//           className={'bg-[#F2FBF3]'}
//           statValue={subcategoryLength}
//           statName={'SubCategories'}
//           expandableBG={'bg-[#F2FBF3]'}
//         />
//       </div>
//       <div
//         className='col-span-12 xl:col-span-4 md:col-span-6'
//         onClick={() => navigate(paths?.admin?.subscriptionInquiry)}
//       >
//         <DashboardStatCard
//           className={'bg-[#fcf8f3]'}
//           statValue={activeItem}
//           statName={'Number of Active Item'}
//           expandableBG={'bg-[#fcf8f3]'}
//         />
//       </div>
      
//       <div className='flex sm:flex-col xs:flex-shrink sm:flex-shrink   md:flex-row gap-4 '>
//         <div className='flex-1 p-4'>
//           <PieChart items={items} units={units}/>
//         </div>
//         <div className='flex-1 p-4  sm:w-[60vh] sm:pt-[55vh]  md:pt-[2vh]'>
//           <LineChart items={items} units={units}/>
//         </div>
        
//       </div>
      

//       <div className='flex flex-row flex-wrap pl-0  sm:w-[60vh] sm:pt-[55vh] md:pt-[55vh] w-[80vh] h-[70vh] '>
//       <div className='bg-gray-300  overflow-y-scroll h-[300px]'>
// Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis eos pariatur sequi.lorem12 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe minus officiis voluptate.
       
       
//        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates, quo quod cupiditate aut excepturi fugiat, nobis doloremque quisquam dignissimos fuga exercitationem. Ipsam reprehenderit accusamus natus illum facilis laborum? Aliquid, porro!lorem12 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis reiciendis at commodi nihil quam doloribus hic, porro laborum non corporis voluptatem quisquam necessitatibus dolorem vel voluptatum delectus ipsum dolores sed.lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex voluptatem error, facere sapiente iste iusto, quidem, saepe vero consectetur perspiciatis voluptate non? Necessitatibus maiores ipsa assumenda minima nam eos debitis. </div>
//     lorem
//       </div>
//       <div className='flex flex-row flex-wrap pl-[400px] sm:w-[60vh] sm:pt-[55vh] md:pt-[55vh] w-[80vh] h-[70vh]'>
// Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, cumque voluptatem! Enim!
//         </div>
//     </div>
//   )
// }

// export default AdminDashboard
import React, { useEffect, useState } from 'react'
import DashboardStatCard from '../../../components/themeComponents/DashboardStatCard'
import { GetDashboardDetails } from '../../../services/dashboardService'
import { GetItems } from '../../../services/itemsService'
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

  useEffect(() => {
    getDashboardDetails()
    getItemsData()
  }, [])

  const getDashboardDetails = async () => {
    dispatch(showLoader())
    try {
      const response = await GetDashboardDetails()
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
      const items = response?.data?.data || []

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
      setPieChartData(chartData)
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
        <LineChart />
       </div>
   </div>
    </div>
  )
}

export default AdminDashboard
