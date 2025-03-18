'use client'

import type React from 'react'
import { useState } from 'react'
import {
  Card,
  Tag,
  Button,
  Space,
  Modal,
  Select,
  Statistic,
  Row,
  Col,
  Spin,
  Empty,
  Timeline,
  Badge,
  Typography,
  Tabs,
  Pagination
} from 'antd'
import {
  EyeOutlined,
  WarningOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import FetalAlertDetail from '../FetalAlertDetail'
import { getSeverityColor } from '@/utils/helper'

dayjs.extend(relativeTime)

const { Text, Title } = Typography
const { TabPane } = Tabs

interface FetalAlertsListProps {
  alerts: IFetalGrowth.FetalAlert[]
  loading?: boolean
}

const getSeverityIcon = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return <ExclamationCircleOutlined />
    case 'warning':
      return <WarningOutlined />
    case 'info':
      return <AlertOutlined />
    default:
      return <AlertOutlined />
  }
}

const FetalAlertsList: React.FC<FetalAlertsListProps> = ({ alerts, loading = false }) => {
  const [selectedAlert, setSelectedAlert] = useState<IFetalGrowth.FetalAlert | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [weekFilter, setWeekFilter] = useState<number | 'all'>('all')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 3 // Number of alerts per page

  const showModal = (alert: IFetalGrowth.FetalAlert) => {
    setSelectedAlert(alert)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedAlert(null)
  }

  // Get unique weeks from alerts for the week filter
  const weeks = Array.from(new Set(alerts.map((alert) => alert.week))).sort((a, b) => a - b)

  // Calculate statistics
  const totalAlerts = alerts.length
  const criticalAlerts = alerts.filter((a) => a.severity.toLowerCase() === 'critical').length
  const warningAlerts = alerts.filter((a) => a.severity.toLowerCase() === 'warning').length
  const infoAlerts = alerts.filter((a) => a.severity.toLowerCase() === 'info').length
  const unresolvedAlerts = alerts.filter((a) => !a.isResolved).length
  const resolvedAlerts = alerts.filter((a) => a.isResolved).length

  const filteredAlerts = alerts.filter((alert) => {
    let matchesSeverity = true
    if (severityFilter !== 'all') {
      matchesSeverity = alert.severity.toLowerCase() === severityFilter.toLowerCase()
    }

    let matchesWeek = true
    if (weekFilter !== 'all') {
      matchesWeek = alert.week === weekFilter
    }

    let matchesTab = true
    if (activeTab !== 'all') {
      matchesTab =
        activeTab === 'critical'
          ? alert.severity.toLowerCase() === 'critical'
          : activeTab === 'unresolved'
            ? !alert.isResolved
            : alert.isResolved
    }

    return matchesSeverity && matchesTab && matchesWeek
  })

  // Sort alerts - critical first, then by date (most recent first)
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Critical alerts come first
    if (a.severity.toLowerCase() === 'critical' && b.severity.toLowerCase() !== 'critical') return -1
    if (a.severity.toLowerCase() !== 'critical' && b.severity.toLowerCase() === 'critical') return 1

    // Then sort by date (most recent first)
    return dayjs(b.alertDate).valueOf() - dayjs(a.alertDate).valueOf()
  })

  // Pagination
  const paginatedAlerts = sortedAlerts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of the alert section when page changes
    const alertsSection = document.getElementById('alerts-timeline')
    if (alertsSection) {
      alertsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const renderAlertCard = (alert: IFetalGrowth.FetalAlert) => {
    const severityColor = getSeverityColor(alert.severity)

    return (
      <Card
        key={alert.id}
        className='mb-4 hover:shadow-md transition-all'
        style={{ borderLeft: `4px solid ${severityColor}` }}
      >
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <div className='flex items-center mb-2'>
              <Badge
                color={severityColor}
                text={
                  <Text strong>
                    <span className='mr-2'>Week {alert.week}</span>
                    <Tag
                      color={severityColor}
                      icon={getSeverityIcon(alert.severity)}
                      className='px-2 py-0.5 rounded-full'
                    >
                      {alert.severity}
                    </Tag>
                    <Tag
                      color={alert.isResolved ? 'success' : 'default'}
                      icon={alert.isResolved ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                      className='px-2 py-0.5 rounded-full'
                    >
                      {alert.isResolved ? 'Resolved' : 'Unresolved'}
                    </Tag>
                  </Text>
                }
              />
            </div>
            <Typography.Paragraph
              ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
              className='block mb-2 font-medium'
            >
              {alert.issue}
            </Typography.Paragraph>
            <div className='text-gray-500 text-sm'>
              <CalendarOutlined className='mr-1' />
              {dayjs(alert.alertDate).format('DD/MM/YYYY HH:mm')}
              <span className='ml-2 text-xs'>({dayjs(alert.alertDate).fromNow()})</span>
            </div>
          </div>
          <Button type='primary' icon={<EyeOutlined />} onClick={() => showModal(alert)} className='rounded-full ml-4'>
            View
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Main Content Card */}
      <Card
        className='shadow-sm transition-shadow'
        title={
          <div className='flex items-center space-x-2'>
            <AlertOutlined className='text-primary' />
            <span>Fetal Growth Alerts</span>
            {criticalAlerts > 0 && <Badge count={criticalAlerts} style={{ backgroundColor: '#f5222d' }} />}
          </div>
        }
        style={{ height: '60.75rem' }}
      >
        {/* Statistics Row */}
        <Row gutter={[12, 12]} className='mb-4'>
          <Col xs={12} sm={6} md={12} lg={6}>
            <Card className='h-full hover:shadow-lg transition-shadow text-center' size='small'>
              <Statistic
                title='Total'
                value={totalAlerts}
                prefix={<AlertOutlined className='text-blue-500' />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={12} lg={6}>
            <Card className='h-full hover:shadow-lg transition-shadow text-center' size='small'>
              <Statistic
                title='Critical'
                value={criticalAlerts}
                prefix={<ExclamationCircleOutlined className='text-red-500' />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={12} lg={6}>
            <Card className='h-full hover:shadow-lg transition-shadow text-center' size='small'>
              <Statistic
                title='Unresolved'
                value={unresolvedAlerts}
                prefix={<ClockCircleOutlined className='text-orange-500' />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={12} lg={6}>
            <Card className='h-full hover:shadow-lg transition-shadow text-center' size='small'>
              <Statistic
                title='Resolved'
                value={resolvedAlerts}
                prefix={<CheckCircleOutlined className='text-green-500' />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters Row */}
        <div className='flex flex-wrap items-center justify-between mb-3'>
          <div className='flex items-center space-x-2 mb-2'>
            <Text strong>Filter by Week:</Text>
            <Select
              style={{ width: 120 }}
              value={weekFilter}
              onChange={(value) => {
                setWeekFilter(value)
                setCurrentPage(1) // Reset to first page when filter changes
              }}
              options={[
                { value: 'all', label: 'All Weeks' },
                ...weeks.map((week) => ({ value: week, label: `Week ${week}` }))
              ]}
              className='rounded-full'
            />
          </div>
          <div className='flex items-center space-x-2 mb-2'>
            <Text strong>Severity:</Text>
            <Select
              value={severityFilter}
              style={{ width: 120 }}
              onChange={(value) => {
                setSeverityFilter(value)
                setCurrentPage(1) // Reset to first page when filter changes
              }}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'critical', label: 'Critical' },
                { value: 'warning', label: 'Warning' },
                { value: 'info', label: 'Info' }
              ]}
              className='rounded-full'
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key)
            setCurrentPage(1) // Reset to first page when tab changes
          }}
          className='mb-3'
          size='small'
        >
          <TabPane
            tab={
              <span className='px-1'>
                <AlertOutlined /> All
                <Badge count={totalAlerts} className='ml-1' size='small' />
              </span>
            }
            key='all'
            data-tab-key='all'
          />
          <TabPane
            tab={
              <span className='px-1'>
                <ExclamationCircleOutlined /> Critical
                <Badge count={criticalAlerts} className='ml-1' size='small' />
              </span>
            }
            key='critical'
            data-tab-key='critical'
          />
          <TabPane
            tab={
              <span className='px-1'>
                <ClockCircleOutlined /> Unresolved
                <Badge count={unresolvedAlerts} className='ml-1' size='small' />
              </span>
            }
            key='unresolved'
            data-tab-key='unresolved'
          />
          <TabPane
            tab={
              <span className='px-1'>
                <CheckCircleOutlined /> Resolved
                <Badge count={resolvedAlerts} className='ml-1' size='small' />
              </span>
            }
            key='resolved'
            data-tab-key='resolved'
          />
        </Tabs>

        {/* Alert Cards with Pagination */}
        <Spin spinning={loading}>
          {sortedAlerts.length > 0 ? (
            <>
              <div id='alerts-timeline' className='alert-cards space-y-2 mb-3'>
                <Timeline>
                  {paginatedAlerts.map((alert) => (
                    <Timeline.Item
                      key={alert.id}
                      color={getSeverityColor(alert.severity)}
                      dot={getSeverityIcon(alert.severity)}
                    >
                      {renderAlertCard(alert)}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>

              {/* Pagination */}
              {sortedAlerts.length > pageSize && (
                <div className='flex justify-center mt-3'>
                  <Pagination
                    current={currentPage}
                    total={sortedAlerts.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    size='small'
                    className='rounded-full'
                  />
                </div>
              )}
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  {weekFilter !== 'all'
                    ? `No alerts found for Week ${weekFilter}`
                    : 'No alerts found for the selected filters'}
                </span>
              }
            />
          )}
        </Spin>
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className='flex items-center space-x-2'>
            <AlertOutlined className='text-primary' />
            <span>Alert Details</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        className='rounded-lg'
      >
        {selectedAlert && <FetalAlertDetail alert={selectedAlert} />}
      </Modal>
    </div>
  )
}

export default FetalAlertsList
