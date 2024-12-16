// import React, { useEffect } from 'react'
// import ApexCharts from 'react-apexcharts';

// export default function PieChart({items,units}) {
//     const options = {
//         series: [44, 55, 13, 43, 22],
//         chart: {
//           width: 380,
//           type: 'pie',
//         },
//         labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
//         responsive: [
//           {
//             breakpoint: 480,
//             options: {
//               chart: {
//                 width: 200,
//               },
//               legend: {
//                 position: 'bottom',
//               },
//             },
//           },
//         ],
      
        
//       };
//       useEffect(()=>{
//         console.log(" hi i am props data from admindahsboard",items,"unit size",units)
        
//       },[])

//   return (
//     <div>  <div id="chart">
//     <ApexCharts options={options} series={options.series} type="pie" width={500} height={350} />
//   </div>
      
//     </div>
//   )
// }
import React from 'react'
import ReactApexChart from 'react-apexcharts'

function PieChart({ data }) {
  const chartOptions = {
    chart: {
      type: 'pie',
    }, title: {
      text: 'Item Distribution',
      align: 'left',
    },
    labels: data.map((item) => item.name),
  }

  const chartSeries = data.map((item) => item.size)

  return (
    <div className="chart-container">
      <ReactApexChart options={chartOptions} series={chartSeries} type="pie" width={500} height={350}  />
    </div>
  )
}

export default PieChart
