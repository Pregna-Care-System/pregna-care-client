import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectPregnancyRecord } from '@/store/modules/global/selector'
import { Layout, Typography } from 'antd'
import PregnancyRecordList from './components/PregnancyRecordList'

const { Content } = Layout
const { Title } = Typography

const mockRecords = [
  { id: '1', motherName: 'Alice Johnson', gestationalAge: 28, lastCheckupDate: '2023-06-15' },
  { id: '2', motherName: 'Emma Smith', gestationalAge: 32, lastCheckupDate: '2023-06-18' },
  { id: '3', motherName: 'Olivia Brown', gestationalAge: 24, lastCheckupDate: '2023-06-14' },
  { id: '4', motherName: 'Sophia Davis', gestationalAge: 36, lastCheckupDate: '2023-06-20' }
]

const FetalGrowthChart = () => {
  const pregnancyRecord = useSelector(selectPregnancyRecord)

  return (
    <Layout className='min-h-screen bg-gray-100'>
      <Content className='p-4 sm:p-6 lg:p-8'>
        <Title level={1} className='text-center mb-8'>
          Pregnancy Records
        </Title>
        <PregnancyRecordList records={pregnancyRecord} />
      </Content>
    </Layout>
  )
}

export default FetalGrowthChart
