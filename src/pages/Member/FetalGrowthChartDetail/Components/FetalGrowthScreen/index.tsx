import React from 'react'
import { Card, Col, Layout, Row, Typography } from 'antd'
import FetusInfo from '../FetalInfo'
import GestationalAgeChart from '../GestationalAgeChart'
import GrowthChart from '../GrowthChart'
import MeasurementCharts from '../MeasurementCharts'
import WeightChart from '../WeightChart'
import ScheduleCard from '../ScheduleCard'
import BarChart from '@/components/Chart/BarChart'

const { Content } = Layout
const { Title } = Typography

interface FetalGrowthScreenProps {
  data: {
    gestationalAge: number
    estimatedWeight: number
    headCircumference: number
    abdominalCircumference: number
    femurLength: number
    dueDate: string
    motherName: string
    growthData: Array<{
      week: number
      weight: number
      standardWeight: number
      hc: number
      standardHC: number
      ac: number
      standardAC: number
      fl: number
      standardFL: number
      [key: string]: number
    }>
  }
}

const FetalGrowthScreen: React.FC<FetalGrowthScreenProps> = ({ data }) => {
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

  const scheduleData = [
    { date: '2025-02-20', description: 'Khám thai định kỳ' },
    { date: '2025-03-15', description: 'Siêu âm 4D' },
    { date: '2025-04-10', description: 'Khám thai định kỳ' },
    { date: '2025-05-05', description: 'Tiêm phòng' },
    { date: '2025-05-30', description: 'Khám thai định kỳ' }
  ]

  const weightEstimation = [
    { x: '20', y: 300, min: 250, max: 350 },
    { x: '21', y: 320, min: 270, max: 370 },
    { x: '22', y: 340, min: 290, max: 390 }
    // Thêm dữ liệu vào đây
  ]

  return (
    <Layout className='bg-transparent'>
      <Content>
        <Title level={2} className='text-center mb-8'>
          {data.motherName}'s Fetal Growth Chart
        </Title>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
          <div className='col-span-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <GestationalAgeChart currentWeek={data.gestationalAge} />
              <GestationalAgeChart currentWeek={data.gestationalAge} />
            </div>
            <GrowthChart
              data={data.growthData}
              title='Fetal Weight Growth'
              dataKey='weight'
              standardKey='standardWeight'
              yAxisLabel='Weight (grams)'
            />
          </div>
          <ScheduleCard scheduleData={scheduleData} />
        </div>
        <div className='mt-8'>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card>
                <BarChart
                  data={weightEstimation}
                  title='Fetal weight'
                  xaxisTitle='Gestational Age (weeks)'
                  yaxisTitle='Weight (grams)'
                />
              </Card>
            </Col>
          </Row>
        </div>
        <div className='mt-8'>
          <MeasurementCharts data={data.growthData} measurements={measurements} />
        </div>
      </Content>
    </Layout>
  )
}

export default FetalGrowthScreen
