import React, { useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const LineChart = ({data1}) => {
  console.log("hi i am data1",data1);
  
  // const options = {
  //   series: [
  //     {
  //       name: "Desktops",
  //       data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
  //     },
  //   ],
  //   chart: {
  //     height: 350,
  //     type: 'line',
  //     zoom: {
  //       enabled: false,
  //     },
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   stroke: {
  //     curve: 'straight',
  //   },
  //   title: {
  //     text: 'Product Trends by Month',
  //     align: 'left',
  //   },
  //   grid: {
  //     row: {
  //       colors: ['#f3f3f3', 'transparent'], // Repeated on alternate rows
  //       opacity: 0.5,
  //     },
  //   },
  //   xaxis: {
  //     categories:items,
  //   },
  // };
  function generateDayWiseTimeSeries(s, count) {
    var values = [[
      4,3,10,9,29,19,25,9,12,7,19,5,13,9,17,2,7,5
    ]];
    const arr=[]
    for(let i of data1)
    {
      const dat=new Date(i.date)
      console.log(dat.getTime());
      arr.push([dat.getTime(),i.count])
      
    }
    console.log(arr);
    
    
    
    return arr;
  }
  var options = {
    chart: {
      type: "area",
      height: 300,
      foreColor: "#999",
      stacked: true,
      dropShadow: {
        enabled: true,
        enabledSeries: [0],
        top: -2,
        left: 2,
        blur: 5,
        opacity: 0.06
      }
    },
    colors: ['#00E396', '#0090FF'],
    stroke: {
      curve: "smooth",
      width: 3
    },
    dataLabels: {
      enabled: false
    },
    series: [{
      name: 'Total count',
      data: generateDayWiseTimeSeries(0, 8)
    }],
    markers: {
      size: 0,
      strokeColor: "#fff",
      strokeWidth: 3,
      strokeOpacity: 1,
      fillOpacity: 1,
      hover: {
        size: 6
      }
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        offsetX: 14,
        offsetY: -5
      },
      tooltip: {
        enabled: true
      }
    },
    grid: {
      padding: {
        left: -5,
        right: 5
      }
    },
    tooltip: {
      x: {
        format: "yyyy MM dd"
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    fill: {
      type: "solid",
      fillOpacity: 0.7
    }
  };

  useEffect(()=>{
  
})
  return (
    <div id="chart">
      <ApexCharts
        options={options}
        series={options.series}
        type="line"
        height={350}
        width={500}
      />
    </div>
  );
};

export default LineChart;
