import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, Select, Typography, Space, Row, Col, Divider } from 'antd'
import { getAllGrowthMetrics } from '@/services/adminService'
import { AxiosResponse } from 'axios'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface GrowthMetric {
  name: string
  unit: string
  description: string
  minValue: number
  maxValue: number
  week: number
}

interface IResponseBase<T> {
  response: T
}

const StandardGrowthChartsPage = () => {
  const [metrics, setMetrics] = useState<GrowthMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<string>('')

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const response: AxiosResponse<IResponseBase<GrowthMetric[]>> = await getAllGrowthMetrics()
        setMetrics(response.data.response || [])
        // Set the first metric as default selected
        if (response.data.response?.length > 0) {
          setSelectedMetric(response.data.response[0].name)
        }
      } catch (error) {
        console.error('Error fetching growth metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  // Get unique metric names for the selector
  const metricNames = [...new Set(metrics.map((metric) => metric.name))]

  // Generate series for the selected metric
  const generateSeries = () => {
    if (!selectedMetric) return []

    // Filter and sort metrics by week for the selected metric
    const selectedMetrics = metrics.filter((m) => m.name === selectedMetric).sort((a, b) => a.week - b.week)

    return [
      {
        name: 'Minimum Value',
        data: selectedMetrics.map((m) => ({ x: m.week, y: Number(m.minValue.toFixed(2)) }))
      },
      {
        name: 'Maximum Value',
        data: selectedMetrics.map((m) => ({ x: m.week, y: Number(m.maxValue.toFixed(2)) }))
      }
    ]
  }

  const chartOptions = {
    chart: {
      type: 'line' as const,
      height: 500,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    colors: ['#1890ff', '#ff4d4f'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: '#f0f0f0',
      strokeDashArray: 4
    },
    title: {
      text: selectedMetric,
      align: 'center' as const
    },
    xaxis: {
      title: {
        text: 'Gestational Age (weeks)'
      },
      type: 'numeric' as const,
      min: 1,
      max: 40
    },
    yaxis: {
      title: {
        text: metrics.find((m) => m.name === selectedMetric)?.unit || ''
      }
    },
    legend: {
      position: 'top' as const
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) =>
          `${value.toFixed(2)} ${metrics.find((m) => m.name === selectedMetric)?.unit || ''}`
      }
    }
  }

  return (
    <div className='standard-growth-charts' style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Space direction='vertical' size='large' style={{ width: '100%' }}>
            <div>
              <Title level={2} style={{ marginBottom: '8px' }}>
                Fetal Growth Metrics
              </Title>
              <Text type='secondary' style={{ fontSize: '16px' }}>
                Monitor and track your baby's growth using standardized measurements
              </Text>
            </div>

            <Card
              style={{
                backgroundColor: '#f8f9fa',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                  <Title level={4} style={{ margin: 0 }}>
                    About These Growth Standards
                  </Title>
                </div>
                <Text>
                  These growth metrics are based on the World Health Organization (WHO) Fetal Growth Standards, which
                  were developed through the INTERGROWTH-21st Project. This is one of the most comprehensive and widely
                  accepted international standards for fetal growth assessment.
                </Text>
                <Divider style={{ margin: '16px 0' }} />
                <Text strong>Key points about these standards:</Text>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Developed through a multi-center, multi-ethnic study</li>
                  <li>Based on healthy pregnancies with optimal conditions</li>
                  <li>Regularly updated with the latest medical research</li>
                  <li>Used by healthcare providers worldwide</li>
                </ul>
                <Text type='secondary' style={{ fontStyle: 'italic' }}>
                  Note: These are reference ranges and should be interpreted by healthcare professionals in the context
                  of your specific pregnancy.
                </Text>
              </Space>
            </Card>

            <Card
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '8px'
              }}
            >
              <Space direction='vertical' size='large' style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    Select Growth Metric
                  </Text>
                  <Select
                    style={{ width: '100%', maxWidth: '400px' }}
                    value={selectedMetric}
                    onChange={setSelectedMetric}
                    options={metricNames.map((name) => ({
                      value: name,
                      label: name
                    }))}
                    size='large'
                  />
                </div>

                {!loading && selectedMetric && (
                  <>
                    <ReactApexChart options={chartOptions} series={generateSeries()} type='area' height={500} />
                    <Card
                      type='inner'
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: 'none'
                      }}
                    >
                      <Text type='secondary'>{metrics.find((m) => m.name === selectedMetric)?.description}</Text>
                    </Card>
                  </>
                )}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default StandardGrowthChartsPage
