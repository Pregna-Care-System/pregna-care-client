import { useState } from 'react'
import { Alert, Card, Table, Form, Input, Button, Space, Typography, Row, Col } from 'antd'
import { WarningOutlined, PlusOutlined } from '@ant-design/icons'
// import { Line } from "@ant-design/charts"

const { Title, Text } = Typography

interface GrowthData {
  age: number
  weight: number
  height: number
  date: string
}

// Sample standard values (should be replaced with actual medical standards)
const standardValues = {
  weight: {
    min: 13, // kg
    max: 18
  },
  height: {
    min: 95, // cm
    max: 110
  }
}

export default function GrowthMonitoring() {
  const [measurements, setMeasurements] = useState<GrowthData[]>([
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

  const [form] = Form.useForm()

  const columns = [
    {
      title: 'Tuổi (tháng)',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight'
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height'
    },
    {
      title: 'Ngày đo',
      dataIndex: 'date',
      key: 'date'
    }
  ]

  const chartData = measurements
    .map((m) => ({
      date: m.date,
      value: m.weight,
      category: 'Cân nặng'
    }))
    .concat(
      measurements.map((m) => ({
        date: m.date,
        value: m.height,
        category: 'Chiều cao'
      }))
    )

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    point: {
      size: 5,
      shape: 'diamond'
    },
    label: {
      style: {
        fill: '#aaa'
      }
    }
  }

  const onFinish = (values: any) => {
    const newMeasurement = {
      ...values,
      date: new Date().toISOString().split('T')[0]
    }
    setMeasurements([...measurements, newMeasurement])
    form.resetFields()
  }

  const getWarnings = () => {
    const latestMeasurement = measurements[measurements.length - 1]
    const warnings = []

    if (latestMeasurement.weight < standardValues.weight.min) {
      warnings.push(
        <Alert
          key='weight-low'
          message='Cảnh báo về cân nặng'
          description={`Cân nặng hiện tại (${latestMeasurement.weight}kg) thấp hơn mức tiêu chuẩn tối thiểu (${standardValues.weight.min}kg)`}
          type='warning'
          showIcon
          icon={<WarningOutlined />}
        />
      )
    }

    if (latestMeasurement.height < standardValues.height.min) {
      warnings.push(
        <Alert
          key='height-low'
          message='Cảnh báo về chiều cao'
          description={`Chiều cao hiện tại (${latestMeasurement.height}cm) thấp hơn mức tiêu chuẩn tối thiểu (${standardValues.height.min}cm)`}
          type='warning'
          showIcon
          icon={<WarningOutlined />}
        />
      )
    }

    return warnings
  }

  return (
    <div className='p-6'>
      <Title level={2}>Theo dõi sự phát triển của trẻ</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction='vertical' style={{ width: '100%' }}>
            {getWarnings()}
          </Space>
        </Col>

        <Col span={12}>
          <Card title='Thêm chỉ số mới'>
            <Form form={form} layout='vertical' onFinish={onFinish}>
              <Form.Item label='Tuổi (tháng)' name='age' rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}>
                <Input type='number' />
              </Form.Item>

              <Form.Item
                label='Cân nặng (kg)'
                name='weight'
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
              >
                <Input type='number' step='0.1' />
              </Form.Item>

              <Form.Item
                label='Chiều cao (cm)'
                name='height'
                rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
              >
                <Input type='number' step='0.1' />
              </Form.Item>

              <Form.Item>
                <Button type='primary' htmlType='submit' icon={<PlusOutlined />}>
                  Thêm chỉ số
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title='Tiêu chuẩn phát triển'>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Alert
                message='Cân nặng tiêu chuẩn'
                description={`${standardValues.weight.min}kg - ${standardValues.weight.max}kg`}
                type='info'
              />
              <Alert
                message='Chiều cao tiêu chuẩn'
                description={`${standardValues.height.min}cm - ${standardValues.height.max}cm`}
                type='info'
              />
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title='Lịch sử đo'>
            <Table columns={columns} dataSource={measurements} rowKey={(record) => record.date} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
