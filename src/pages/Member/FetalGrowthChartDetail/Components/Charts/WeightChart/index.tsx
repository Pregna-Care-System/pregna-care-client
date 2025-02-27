import type React from 'react'
import Chart from 'react-apexcharts'
import { ChartCard } from '../../../styles/styled-components'
import { mockAmnioticData } from '@/utils/constants/mock-data'

interface WeightChartProps {
  title?: string
}

const WeightChart: React.FC<WeightChartProps> = ({ title = 'Amniotic Fluid Index' }) => {
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
      data: mockAmnioticData.data
    },
    {
      name: 'Minimum value',
      data: mockAmnioticData.min.map((y, i) => ({ x: chartWeeks[i], y })),
      dashArray: 5
    },
    {
      name: 'Maximum value',
      data: mockAmnioticData.max.map((y, i) => ({ x: chartWeeks[i], y })),
      dashArray: 5
    }
  ]

  return (
    <ChartCard title={title}>
      <Chart options={chartOptions} series={series} type='line' height={350} />
    </ChartCard>
  )
}

export default WeightChart
