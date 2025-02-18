import type React from 'react'
import { Card } from 'antd'
import Chart from 'react-apexcharts'

interface GestationalAgeChartProps {
  currentWeek: number
}

const GestationalAgeChart: React.FC<GestationalAgeChartProps> = ({ currentWeek }) => {
  const percentage = (currentWeek / 40) * 100

  const options = {
    chart: {
      height: 350,
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '75%',
          background: '#fff'
        },
        track: {
          background: '#f2f2f2',
          strokeWidth: '100%',
          margin: 0
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: 20,
            show: true,
            color: '#6B7280',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif'
          },
          value: {
            offsetY: -10,
            color: '#111827',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            formatter: (val: number) => `${Math.round(val)}%`
          }
        }
      }
    },
    fill: {
      type: 'solid',
      colors: ['#FF7B63'] // Coral color matching the image
    },
    stroke: {
      lineCap: 'round',
      width: 0
    },
    labels: ['']
  }

  const series = [percentage]

  return (
    <Card className='shadow-sm'>
      <div className='flex items-center justify-center'>
        <div>
          <p className='text-lg text-gray-600'>Gestational Age:</p>
          <p className='text-base text-gray-600'>Week {currentWeek} of 40</p>
        </div>
        <Chart options={options} series={series} type='radialBar' width={100} height={100} />
      </div>
    </Card>
  )
}

export default GestationalAgeChart
