import React, { useEffect } from 'react'
import { Breadcrumb, Card, Col, Layout, Row, Typography, Button, Alert } from 'antd'
import GestationalAgeChart from '../GestationalAgeChart'
import GrowthChart from '../GrowthChart'
import ScheduleCard from '../ScheduleCard'
import BarChart from '@/components/Chart/BarChart'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'
import { getPregnancyRecordById } from '@/services/pregnancyRecordService'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@/store/modules/global/selector'
import dayjs from 'dayjs'
import FetalAlertsList from '../FetalAlertList/index.tsx'

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

interface GrowthData {
  age: number
  weight: number
  height: number
  date: string
}

const sampleAlerts = [
  {
    id: '36f2b65f-45c7-4bcb-8f78-1e41773592cc',
    fetalGrowthRecordId: 'd483023c-8ca1-4f89-8cf5-8557ba64bc3b',
    week: 40,
    alertDate: '2025-02-15T23:13:22.57',
    alertFor: 'Fetal',
    issue:
      'The provided measurement value (0.1 Kg) is significantly lower than the expected range for fetal weight at 40 weeks of pregnancy.',
    severity: 'Critical',
    recommendation:
      'Severity: HIGH\nExpected Range in Week 40: 2.5 - 3.5\nRecommendation: This significant deviation from the expected range warrants immediate medical attention.',
    isResolved: false
  },
  {
    id: '46f2b65f-45c7-4bcb-8f78-1e41773592cd',
    fetalGrowthRecordId: 'e483023c-8ca1-4f89-8cf5-8557ba64bc3c',
    week: 38,
    alertDate: '2025-02-14T23:13:22.57',
    alertFor: 'Fetal',
    issue: 'Slight deviation from expected fetal weight range detected.',
    severity: 'Warning',
    recommendation:
      'Severity: MEDIUM\nExpected Range in Week 38: 2.3 - 3.3\nRecommendation: Schedule a follow-up appointment for monitoring.',
    isResolved: true
  }
  // Add more sample alerts as needed
]

const FetalGrowthScreen: React.FC<FetalGrowthScreenProps> = ({ data }) => {
  const navigate = useNavigate()
  const [pregnancyInfo, setPregnancyInfo] = React.useState<any>({
    babyName: '',
    gestationalAgeResponse: { weeks: 0, days: 0 }
  })
  const [measurements, setMeasurements] = React.useState<GrowthData[]>([
    {
      age: 36,
      weight: 12,
      height: 92,
      date: '2024-02-25'
    },
    {
      age: 37,
      weight: 12.5,
      height: 93,
      date: '2024-02-26'
    }
  ])
  const param = useParams()
  const user = useSelector(selectUserInfo)

  const getPregrancyInfo = async () => {
    try {
      if (user.id && param.pregnancyRecordId) {
        const res = await getPregnancyRecordById(user.id, param.pregnancyRecordId)
        if (res.success) {
          setPregnancyInfo(res.response)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    getPregrancyInfo()
  }, [param.pregnancyRecordId])

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
        <Breadcrumb className='mb-4'>
          <Breadcrumb.Item>
            <Link to={ROUTES.MEMBER.FETALGROWTHCHART}>Pregnancy Records</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{pregnancyInfo.babyName}'s Growth Chart</Breadcrumb.Item>
        </Breadcrumb>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
          <div className='col-span-2'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
              <GestationalAgeChart currentWeek={pregnancyInfo.gestationalAgeResponse.weeks} />
              <Card className='shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <Title level={5} className='mb-0'>
                      Current day of week:
                    </Title>
                    <Title level={3} className='mb-0'>
                      {pregnancyInfo.gestationalAgeResponse.days} day
                    </Title>
                  </div>
                </div>
              </Card>
              <Card className='shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <Title level={5} className='mb-0'>
                      Estimated due date:
                    </Title>
                    <Title level={3} className='mb-0'>
                      {dayjs(pregnancyInfo.gestationalAgeResponse?.estimatedDueDate).format('DD-MM-YYYY')}
                    </Title>
                  </div>
                </div>
              </Card>
            </div>
            <GrowthChart
              data={data.growthData}
              title='Fetal Weight Growth'
              dataKey='weight'
              standardKey='standardWeight'
              yAxisLabel='Weight (grams)'
            />
            <Card className='mt-6'>
              <BarChart
                data={weightEstimation}
                title='Fetal weight'
                xaxisTitle='Gestational Age (weeks)'
                yaxisTitle='Weight (grams)'
              />
            </Card>
          </div>
          <ScheduleCard scheduleData={scheduleData} />
        </div>
        <div className='mt-8'>
          <Row gutter={[16, 16]}>
            <Col span={16}></Col>
            <Col span={8}></Col>
          </Row>
        </div>
        <div className='mt-8'>
          <FetalAlertsList alerts={sampleAlerts} />
        </div>
      </Content>
    </Layout>
  )
}

export default FetalGrowthScreen
