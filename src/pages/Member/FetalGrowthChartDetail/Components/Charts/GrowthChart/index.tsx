import type React from 'react'
import Chart from 'react-apexcharts'
import { ChartCard } from '../../../styles/styled-components'

interface GrowthChartProps {
  data: IFetalGrowth.GrowthData[]
  title: string
  dataKey: string
  standardKey: string
  yAxisLabel: string
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data, title, dataKey, standardKey, yAxisLabel }) => {
  // Transform data for chart
  const chartData = data.map((item) => ({
    x: item.week,
    y: item[dataKey]
  }))

  const standardData = data.map((item) => ({
    x: item.week,
    y: item[standardKey]
  }))

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: [3, 2]
    },
    colors: ['#2563eb', '#dc2626'],
    xaxis: {
      title: {
        text: 'Gestational Age (weeks)'
      }
    },
    yaxis: {
      title: {
        text: yAxisLabel
      }
    },
    markers: {
      size: 4
    },
    legend: {
      position: 'top'
    }
  }

  const series = [
    {
      name: `Actual ${title}`,
      data: chartData
    },
    {
      name: `Standard ${title}`,
      data: standardData,
      dashArray: 5
    }
  ]

  return (
    <ChartCard title={title}>
      <Chart options={chartOptions} series={series} type='line' height={350} />
    </ChartCard>
  )
}

export default GrowthChart
