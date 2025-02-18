import type React from 'react'
import { Card } from 'antd'
import Chart from 'react-apexcharts'

interface GrowthData {
  week: number
  weight: number
  standardWeight: number
  [key: string]: number
}

interface GrowthChartProps {
  data: GrowthData[]
  title: string
  dataKey: string
  standardKey: string
  yAxisLabel: string
}

const weeks = Array.from({ length: 33 }, (_, i) => i + 8)

const sampleData = {
  heartRate: {
    data: weeks.map((week) => ({
      x: week,
      y: Math.round(140 + Math.sin(week / 2) * 10)
    })),
    min: weeks.map(() => 120),
    max: weeks.map(() => 160)
  }
}

const GrowthChart = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: [3, 2, 2]
    },
    colors: ['#2563eb', '#dc2626', '#dc2626'],
    xaxis: {
      title: {
        text: 'Gestational Age (weeks)'
      }
    },
    yaxis: {
      title: {
        text: 'Heart rate (bpm)'
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
      name: 'Heart rate value',
      data: sampleData.heartRate.data
    },
    {
      name: 'Minimum value',
      data: sampleData.heartRate.min.map((y, i) => ({ x: weeks[i], y })),
      dashArray: 5
    },
    {
      name: 'Maximum value',
      data: sampleData.heartRate.max.map((y, i) => ({ x: weeks[i], y })),
      dashArray: 5
    }
  ]

  return (
    <Card title='Fetal Heart Rate' className='shadow-md'>
      <Chart options={chartOptions} series={series} type='line' height={350} />
    </Card>
  )
}

export default GrowthChart
