'use client'

import { useState } from 'react'
import { Table, Tag, Button, Input, Space, Modal, Card, Select, Statistic, Row, Col, Spin, Empty } from 'antd'
import {
  EyeOutlined,
  SearchOutlined,
  WarningOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import FetalAlertDetail from '../FetalAlertDetail'

dayjs.extend(relativeTime)

const { Search } = Input

interface FetalAlert {
  id: string
  fetalGrowthRecordId: string
  week: number
  alertDate: string
  alertFor: string
  issue: string
  severity: string
  recommendation: string
  isResolved: boolean
}

interface FetalAlertsListProps {
  alerts: FetalAlert[]
  loading?: boolean
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#ff4d4f'
    case 'warning':
      return '#faad14'
    case 'info':
      return '#1890ff'
    default:
      return '#1890ff'
  }
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

export default function FetalAlertsList({ alerts, loading = false }: FetalAlertsListProps) {
  const [selectedAlert, setSelectedAlert] = useState<FetalAlert | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const showModal = (alert: FetalAlert) => {
    setSelectedAlert(alert)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedAlert(null)
  }

  // Calculate statistics
  const totalAlerts = alerts.length
  const criticalAlerts = alerts.filter((a) => a.severity.toLowerCase() === 'critical').length
  const unresolvedAlerts = alerts.filter((a) => !a.isResolved).length
  const resolvedAlerts = alerts.filter((a) => a.isResolved).length

  const columns: ColumnsType<FetalAlert> = [
    {
      title: 'Week',
      dataIndex: 'week',
      key: 'week',
      sorter: (a, b) => a.week - b.week,
      render: (week) => <div className='font-semibold'>{week}</div>,
      width: 100
    },
    {
      title: 'Alert Date',
      dataIndex: 'alertDate',
      key: 'alertDate',
      render: (date) => (
        <Space direction='vertical' size={0}>
          <span>{dayjs(date).format('DD/MM/YYYY HH:mm')}</span>
          <span className='text-xs text-gray-500'>{dayjs(date).fromNow()}</span>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.alertDate).unix() - dayjs(b.alertDate).unix(),
      width: 180
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Tag
          color={getSeverityColor(severity)}
          icon={getSeverityIcon(severity)}
          className='px-3 py-1 rounded-full text-sm font-medium'
        >
          {severity}
        </Tag>
      ),
      filters: [
        { text: 'Critical', value: 'Critical' },
        { text: 'Warning', value: 'Warning' },
        { text: 'Info', value: 'Info' }
      ],
      onFilter: (value, record) => record.severity === value,
      width: 120
    },
    {
      title: 'Issue',
      dataIndex: 'issue',
      key: 'issue',
      render: (text) => <div className='max-w-lg overflow-hidden text-ellipsis whitespace-nowrap'>{text}</div>
    },
    {
      title: 'Status',
      dataIndex: 'isResolved',
      key: 'isResolved',
      render: (isResolved) => (
        <Tag
          icon={isResolved ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          color={isResolved ? 'success' : 'default'}
          className='px-3 py-1 rounded-full text-sm font-medium'
        >
          {isResolved ? 'Isresolved' : 'Unresolved'}
        </Tag>
      ),
      filters: [
        { text: 'Isresolved', value: true },
        { text: 'Unresolved', value: false }
      ],
      onFilter: (value, record) => record.isResolved === value,
      width: 130
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type='primary' icon={<EyeOutlined />} onClick={() => showModal(record)} className='rounded-full'>
          Details
        </Button>
      ),
      width: 120,
      fixed: 'right'
    }
  ]

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.issue.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.recommendation.toLowerCase().includes(searchText.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || alert.severity.toLowerCase() === severityFilter.toLowerCase()
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'resolved' ? alert.isResolved : !alert.isResolved)

    return matchesSearch && matchesSeverity && matchesStatus
  })

  return (
    <div className='space-y-6'>
      {/* Main Content Card */}
      <Card
        className='shadow-sm hover:shadow-lg transition-shadow'
        title={
          <div className='flex items-center space-x-2'>
            <AlertOutlined className='text-primary' />
            <span>Danh sách cảnh báo</span>
          </div>
        }
      >
        <Row gutter={[16, 16]} className='mb-4'>
          <Col xs={24} sm={12} md={6}>
            <Card className='h-full hover:shadow-lg transition-shadow bg-white'>
              <Statistic
                title='Total Alerts'
                value={totalAlerts}
                prefix={<AlertOutlined className='text-blue-500' />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className='h-full hover:shadow-lg transition-shadow bg-white'>
              <Statistic
                title='Critical Alerts'
                value={criticalAlerts}
                prefix={<ExclamationCircleOutlined className='text-red-500' />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className='h-full hover:shadow-lg transition-shadow bg-white'>
              <Statistic
                title='Unresolved Alerts'
                value={unresolvedAlerts}
                prefix={<ClockCircleOutlined className='text-orange-500' />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className='h-full hover:shadow-lg transition-shadow'>
              <Statistic
                title='Resolved Alerts'
                value={resolvedAlerts}
                prefix={<CheckCircleOutlined className='text-green-500' />}
              />
            </Card>
          </Col>
        </Row>
        <Space direction='vertical' size='middle' className='w-full'>
          {/* Filters */}
          <div className='flex flex-wrap gap-4 items-center justify-between'>
            <Space wrap>
              <Search
                placeholder='Tìm kiếm cảnh báo...'
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                className='rounded-full'
                prefix={<SearchOutlined className='text-gray-400' />}
              />
              <Select
                defaultValue='all'
                style={{ width: 120 }}
                onChange={(value) => setSeverityFilter(value)}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'info', label: 'Info' }
                ]}
                className='rounded-full'
              />
              <Select
                defaultValue='all'
                style={{ width: 120 }}
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'resolved', label: 'Đã xử lý' },
                  { value: 'unresolved', label: 'Chưa xử lý' }
                ]}
                className='rounded-full'
              />
            </Space>
          </div>

          {/* Table */}
          <Spin spinning={loading}>
            {filteredAlerts.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredAlerts}
                rowKey='id'
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} alerts`,
                  className: 'rounded-full'
                }}
                className='shadow-sm'
                scroll={{ x: 'max-content' }}
                rowClassName={(record) => (record.severity.toLowerCase() === 'critical' ? 'bg-red-50' : '')}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không tìm thấy cảnh báo nào' />
            )}
          </Spin>
        </Space>
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className='flex items-center space-x-2'>
            <AlertOutlined className='text-primary' />
            <span>Chi tiết cảnh báo</span>
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
