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
  amniotic: {
    data: weeks.map((week) => ({
      x: week,
      y: 13 + Math.sin(week / 3) * 2
    })),
    min: weeks.map(() => 8),
    max: weeks.map(() => 18)
  }
}

const WeightChart = () => {
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
        text: 'AFI (cm)'
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
      name: 'Amniotic fluid value',
      data: sampleData.amniotic.data
    },
    {
      name: 'Minimum value',
      data: sampleData.amniotic.min.map((y, i) => ({ x: weeks[i], y })),
      dashArray: 5
    },
    {
      name: 'Maximum value',
      data: sampleData.amniotic.max.map((y, i) => ({ x: weeks[i], y })),
      dashArray: 5
    }
  ]

  return (
    <Card title='Fetal Weight' className='shadow-md'>
      <Chart options={chartOptions} series={series} type='line' height={350} />
    </Card>
  )
}

export default WeightChart
