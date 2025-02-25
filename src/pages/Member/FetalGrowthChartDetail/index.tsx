import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { Breadcrumb, Layout, Typography } from 'antd'
import FetalGrowthScreen from './Components/FetalGrowthScreen'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { selectFetalGrowthRecord, selectGrowthMetrics } from '@/store/modules/global/selector'

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
  const dispatch = useDispatch()
  const param = useParams()

  const fetalGrowthRecords = useSelector(selectFetalGrowthRecord)
  const growthMetrics = useSelector(selectGrowthMetrics)

  useEffect(() => {
    if (param.pregnancyRecordId) {
      dispatch({ type: 'GET_FETAL_GROWTH_RECORDS', payload: { pregnancyRecordId: param.pregnancyRecordId } })
    }
  }, [param.pregnancyRecordId])

  useEffect(() => {
    dispatch({ type: 'GET_ALL_GROWTH_METRICS' })
  }, [dispatch])

  return (
    <Content className=''>
      <FetalGrowthScreen data={mockData} />
    </Content>
  )
}

export default FetalGrowthChartDetail
