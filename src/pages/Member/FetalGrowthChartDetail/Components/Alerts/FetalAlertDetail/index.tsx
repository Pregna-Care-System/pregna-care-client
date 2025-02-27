import type React from 'react'
import { Card, Typography, Tag, Space, Divider, Alert, Steps } from 'antd'
import {
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { formatDate, getSeverityColor, parseRecommendation } from '@/utils/helper'

const { Title, Text } = Typography

interface FetalAlertDetailProps {
  alert: IFetalGrowth.FetalAlert
}

const FetalAlertDetail: React.FC<FetalAlertDetailProps> = ({ alert }) => {
  const recommendationItems = parseRecommendation(alert.recommendation)

  return (
    <Space direction='vertical' size='large' className='w-full'>
      {/* Header Card */}
      <Card className='w-full border-t-4' style={{ borderTopColor: getSeverityColor(alert.severity) }}>
        <Space direction='vertical' size='middle' className='w-full'>
          <div className='flex items-center justify-between'>
            <Space>
              <WarningOutlined style={{ fontSize: '24px', color: getSeverityColor(alert.severity) }} />
              <Title level={4} style={{ margin: 0 }}>
                Cảnh báo tuần thai {alert.week}
              </Title>
            </Space>
            <Space>
              <Tag
                color={getSeverityColor(alert.severity)}
                icon={<AlertOutlined />}
                className='px-3 py-1 rounded-full text-sm font-medium'
              >
                {alert.severity}
              </Tag>
              <Tag
                color={alert.isResolved ? 'success' : 'default'}
                icon={alert.isResolved ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                className='px-3 py-1 rounded-full text-sm font-medium'
              >
                {alert.isResolved ? 'Đã xử lý' : 'Chưa xử lý'}
              </Tag>
            </Space>
          </div>

          <Alert message={alert.issue} type='warning' showIcon className='rounded-lg' />
        </Space>
      </Card>

      {/* Details Card */}
      <Card className='w-full'>
        <Space direction='vertical' size='middle' className='w-full'>
          <Title level={5}>
            <InfoCircleOutlined className='mr-2' />
            Thông tin chi tiết
          </Title>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Text type='secondary' className='block'>
                <CalendarOutlined className='mr-2' />
                Ngày cảnh báo
              </Text>
              <Text strong>{formatDate(alert.alertDate)}</Text>
            </div>
            <div className='space-y-2'>
              <Text type='secondary' className='block'>
                <InfoCircleOutlined className='mr-2' />
                ID Cảnh báo
              </Text>
              <Text strong>{alert.id}</Text>
            </div>
          </div>

          <Divider />

          {/* Recommendations */}
          <div className='space-y-4'>
            <Title level={5}>
              <AlertOutlined className='mr-2' />
              Khuyến nghị và hướng dẫn
            </Title>

            <Steps
              direction='vertical'
              current={-1}
              items={recommendationItems.map((item) => ({
                title: item.key,
                description: item.value,
                status: item.key.toLowerCase().includes('severity') ? 'error' : 'process'
              }))}
            />
          </div>
        </Space>
      </Card>
    </Space>
  )
}

export default FetalAlertDetail
