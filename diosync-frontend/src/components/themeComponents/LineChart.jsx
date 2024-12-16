import React, { useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const LineChart = (props) => {
  const {items,units}=props
  const options = {
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: 'Product Trends by Month',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // Repeated on alternate rows
        opacity: 0.5,
      },
    },
    xaxis: {
      categories:items,
    },
  };
useEffect(()=>{
  console.log("i am items and units",items,"units",units);
  
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
