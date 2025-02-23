import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBabyInfo } from '@/store/modules/global/selector'
import { useLocation, useParams } from 'react-router-dom'
import { Breadcrumb, Layout, Typography } from 'antd'
import FetalGrowthScreen from './Components/FetalGrowthScreen'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'

const { Content } = Layout
const { Title } = Typography

const mockData = {
  gestationalAge: 20,
  estimatedWeight: 1200,
  headCircumference: 26.5,
  abdominalCircumference: 23.8,
  femurLength: 5.2,
  dueDate: '2023-12-15',
  motherName: 'Alice Johnson',
  growthData: [
    {
      week: 20,
      weight: 300,
      standardWeight: 320,
      hc: 18,
      standardHC: 17.5,
      ac: 16,
      standardAC: 15.7,
      fl: 3,
      standardFL: 3.1
    },
    {
      week: 24,
      weight: 600,
      standardWeight: 630,
      hc: 22,
      standardHC: 21.8,
      ac: 20,
      standardAC: 19.8,
      fl: 4,
      standardFL: 4.2
    },
    {
      week: 28,
      weight: 1200,
      standardWeight: 1250,
      hc: 26.5,
      standardHC: 26.7,
      ac: 23.8,
      standardAC: 24.2,
      fl: 5.2,
      standardFL: 5.4
    }
    // Add more weeks as needed
  ]

  // Add more mock data for other IDs
}

const FetalGrowthChartDetail = () => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()
  const param = useParams()
  const { id } = param

  const measurements = [
    { key: 'hc', name: 'Head Circumference', color: '#8884d8', standardKey: 'standardHC', standardColor: '#a4a1e4' },
    {
      key: 'ac',
      name: 'Abdominal Circumference',
      color: '#82ca9d',
      standardKey: 'standardAC',
      standardColor: '#a7e3bc'
    },
    { key: 'fl', name: 'Femur Length', color: '#ffc658', standardKey: 'standardFL', standardColor: '#ffe0a3' }
  ]

  useEffect(() => {
    dispatch({ type: 'GET_FETAL_GROWTH_RECORDS', payload: param.pregnancyRecordId })
  }, [param.pregnancyRecordId])

  const fetalWeightData = {
    series: [
      {
        name: '2024',
        data: [300, 600, 1200, 1800, 2500, 3000]
      }
    ],
    options: {
      chart: {
        type: 'line',
        height: 300
      },
      stroke: {
        width: 2
      },
      xaxis: {
        categories: ['6-12', '16-20', '24-28', '32-34', '36', '38-40'],
        title: {
          text: 'Weeks'
        }
      },
      yaxis: {
        title: {
          text: 'Weight (g)'
        }
      },
      legend: {
        position: 'top'
      }
    }
  }

  const fetalMeasurementsData = {
    series: [
      {
        name: 'Head Circumference',
        data: [18, 22, 26.5, 30, 33]
      },
      {
        name: 'Abdominal Circumference',
        data: [16, 20, 23.8, 28, 32]
      },
      {
        name: 'Femur Length',
        data: [3, 4, 5.2, 6, 7]
      }
    ],
    options: {
      chart: {
        type: 'line',
        height: 300
      },
      stroke: {
        width: 2
      },
      xaxis: {
        categories: ['6-12', '16-20', '24-28', '32-34', '36', '38-40'],
        title: {
          text: 'Weeks'
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }

  const babyInfo = useSelector(selectBabyInfo)

  return (
    <Layout className='min-h-screen bg-gray-100'>
      <Content className=''>
        <FetalGrowthScreen data={mockData} />
      </Content>
    </Layout>
  )
}

export default FetalGrowthChartDetail
