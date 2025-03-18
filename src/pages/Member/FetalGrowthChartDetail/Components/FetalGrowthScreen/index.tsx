import type React from 'react'
import { useEffect, useState } from 'react'
import { Breadcrumb, Card, Col, Layout, Row, Typography, Space, Spin } from 'antd'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { AlertCircle, Baby, Calendar, Clock } from 'lucide-react'
import { CriticalAlert, StyledLayout } from '../../styles/styled-components'
import ROUTES from '@/utils/config/routes'
import GestationalAgeChart from '../Charts/GestationalAgeChart'
import ScheduleCard from '../ScheduleCard'
import FetalAlertsList from '../Alerts/FetalAlertList'
import { fetalGrowthStats } from '@/services/pregnancyRecordService'
import EnhancedFetalChart from '../Charts/EnhancedFetalChart'
import { getFetalGrowthAlert } from '@/services/fetalGrowthRecordService'
import { mockFetalAlerts } from '@/utils/constants/mock-data'

const { Content } = Layout
const { Title, Text } = Typography

interface FetalGrowthScreenProps {
  selectedPregnancy: IFetalGrowth.PregnancyInfo | null
}

const FetalGrowthScreen: React.FC<FetalGrowthScreenProps> = ({ selectedPregnancy }) => {
  const [loading, setLoading] = useState(true)
  const [fetalData, setFetalData] = useState([])
  const [alertData, setAlertData] = useState([])

  const getFetalGrowthStats = async () => {
    try {
      if (selectedPregnancy) {
        const res = await fetalGrowthStats(selectedPregnancy.id)
        setFetalData(res.response)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getFetalAlerts = async () => {
    try {
      if (selectedPregnancy) {
        const res = await getFetalGrowthAlert(selectedPregnancy.id)
        setAlertData(res.data.response)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    if (selectedPregnancy) {
      getFetalGrowthStats()
      getFetalAlerts()
      setLoading(false)
    }
  }, [selectedPregnancy])

  // Filter critical alerts (this should be updated to use actual data when available)
  const criticalAlerts = mockFetalAlerts.filter(
    (alert) => alert.severity.toLowerCase() === 'critical' && !alert.isResolved
  )

  if (loading) {
    return (
      <div className='loading-container'>
        <Spin size='large' tip='Loading pregnancy information...' />
      </div>
    )
  }

  if (!selectedPregnancy) {
    return (
      <div className='loading-container'>
        <Text>No pregnancy record selected. Please select a pregnancy record to view details.</Text>
      </div>
    )
  }

  return (
    <StyledLayout className='bg-transparent'>
      <Content>
        {/* Header Section */}
        <div className='header-section'>
          <div className='content'>
            <Breadcrumb className='breadcrumb'>
              <Breadcrumb.Item>
                <Link to={ROUTES.MEMBER.FETALGROWTHCHART}>Pregnancy Records</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{selectedPregnancy.babyName}'s Growth Chart</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* Critical Alerts Section */}
        {criticalAlerts.length > 0 && (
          <Space direction='vertical' className='w-full mb-6'>
            {criticalAlerts.map((alert) => (
              <CriticalAlert
                key={alert.id}
                message={
                  <Space>
                    <AlertCircle className='text-red-600' />
                    <span className='font-medium'>Critical Alert - Week {alert.week}</span>
                  </Space>
                }
                description={alert.issue}
                type='error'
                showIcon
                action={
                  <Link to='#alerts-section' className='alert-action'>
                    View Details →
                  </Link>
                }
              />
            ))}
          </Space>
        )}

        {/* Main Content Grid */}
        <Row gutter={[24, 24]}>
          {/* Left Column - Growth Charts */}
          <Col xs={24} xl={16}>
            {/* Summary Cards */}
            <Row gutter={[16, 16]} className='mb-6'>
              <Col xs={24} md={8}>
                <Card className='stat-card'>
                  <div className='flex items-center justify-between w-full'>
                    <div>
                      <div className='stat-title'>
                        <Baby size={20} />
                        <span>Gestational Age</span>
                      </div>
                      <Title level={5} className='stat-value'>
                        Week {selectedPregnancy.gestationalAgeResponse.weeks} of 40
                      </Title>
                    </div>
                    <GestationalAgeChart currentWeek={selectedPregnancy.gestationalAgeResponse.weeks} />
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className='stat-card'>
                  <div className='stat-title'>
                    <Clock size={20} />
                    <span>Current Progress</span>
                  </div>
                  <div className='flex items-end gap-2'>
                    <Title level={2} className='stat-value'>
                      {selectedPregnancy.gestationalAgeResponse.days}
                    </Title>
                    <Text className='stat-subtitle'>days this week</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className='stat-card'>
                  <div className='stat-title'>
                    <Calendar size={20} />
                    <span>Due Date</span>
                  </div>
                  <Title level={2} className='stat-value'>
                    {dayjs(selectedPregnancy.gestationalAgeResponse?.estimatedDueDate).format('DD/MM')}
                  </Title>
                  <Text className='stat-subtitle'>
                    {dayjs(selectedPregnancy.gestationalAgeResponse?.estimatedDueDate).format('YYYY')}
                  </Text>
                </Card>
              </Col>
            </Row>

            {/* Growth Charts */}
            <Space direction='vertical' size='large' className='w-full'>
              <Card className='chart-card'>
                <EnhancedFetalChart fetalData={fetalData} sharing={true} />
              </Card>
            </Space>
          </Col>

          {/* Right Column - Schedule & Alerts */}
          <Col xs={24} xl={8}>
            <Space direction='vertical' size='large' className='w-full'>
              <ScheduleCard pregnancyId={selectedPregnancy.id} />
            </Space>
          </Col>
          <Col xs={24} xl={24}>
            <div id='alerts-section'>
              <FetalAlertsList alerts={alertData} />
            </div>
          </Col>
        </Row>
      </Content>
    </StyledLayout>
  )
}

export default FetalGrowthScreen
