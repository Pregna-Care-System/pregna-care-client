import React from 'react'
import Chart from 'react-apexcharts'

interface DataPoint {
  x: string
  y: number
  min: number
  max: number
}

interface BarChartProps {
  data: DataPoint[]
  title: string
  xaxisTitle: string
  yaxisTitle: string
}

const BarChart: React.FC<BarChartProps> = ({ data, title, xaxisTitle, yaxisTitle }) => {
  const options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: title
    },
    xaxis: {
      type: 'category',
      title: {
        text: xaxisTitle
      },
      categories: data.map((d) => d.x)
    },
    yaxis: {
      title: {
        text: yaxisTitle
      }
    }
  }

  const series = [
    {
      name: 'Your weight',
      data: data.map((d) => d.y)
    },
    {
      name: 'Min weight',
      data: data.map((d) => d.min)
    },
    {
      name: 'Max weight',
      data: data.map((d) => d.max)
    }
  ]

  return <Chart options={options} series={series} type='bar' height={400} />
}

export default BarChart
