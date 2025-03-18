import type React from 'react'
import { useEffect, useState } from 'react'
import { Breadcrumb, Card, Col, Layout, Row, Typography, Space, Spin, Alert, Button } from 'antd'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { AlertCircle, Baby, Calendar, Clock, ChevronRight } from 'lucide-react'
import { CriticalAlert, StyledLayout } from '../../styles/styled-components'
import ROUTES from '@/utils/config/routes'
import GestationalAgeChart from '../Charts/GestationalAgeChart'
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
  const [alertData, setAlertData] = useState<IFetalGrowth.FetalAlert[]>([])
  const [alertsLoading, setAlertsLoading] = useState(true)

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
      setAlertsLoading(true)
      if (selectedPregnancy) {
        const res = await getFetalGrowthAlert(selectedPregnancy.id)
        const responseData = res.data.response || []
        setAlertData(responseData as IFetalGrowth.FetalAlert[])
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
      // Fallback to mock data in case of error
      setAlertData(mockFetalAlerts)
    } finally {
      setAlertsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedPregnancy) {
      getFetalGrowthStats()
      getFetalAlerts()
      setLoading(false)
    }
  }, [selectedPregnancy])

  // Filter critical alerts
  const criticalAlerts =
    alertData.length > 0
      ? alertData.filter((alert) => alert.severity.toLowerCase() === 'critical' && !alert.isResolved)
      : mockFetalAlerts.filter((alert) => alert.severity.toLowerCase() === 'critical' && !alert.isResolved)

  const scrollToAlerts = () => {
    const alertsSection = document.getElementById('alerts-section')
    if (alertsSection) {
      alertsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Set the tab to 'critical' to show only critical alerts
      const criticalTab = document.querySelector('[data-tab-key="critical"]')
      if (criticalTab && criticalTab instanceof HTMLElement) {
        criticalTab.click()
      }
    }
  }

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

        {/* Critical Alerts Summary */}
        {criticalAlerts.length > 0 && (
          <Alert
            message={
              <div className='flex items-center justify-between'>
                <Space align='center'>
                  <AlertCircle className='text-red-600' size={20} />
                  <span className='font-medium'>
                    You have {criticalAlerts.length} critical {criticalAlerts.length === 1 ? 'alert' : 'alerts'} that
                    require your attention
                  </span>
                </Space>
                <Button type='primary' danger onClick={scrollToAlerts} className='flex items-center'>
                  View Details
                  <ChevronRight className='ml-1' size={16} />
                </Button>
              </div>
            }
            type='error'
            showIcon={false}
            className='mb-6'
          />
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
          <Col xs={24} xl={8} id='alerts-section'>
            <Space direction='vertical' size='large' className='w-full'>
              <FetalAlertsList alerts={alertData} loading={alertsLoading} />
            </Space>
          </Col>
        </Row>
      </Content>
    </StyledLayout>
  )
}

export default FetalGrowthScreen
