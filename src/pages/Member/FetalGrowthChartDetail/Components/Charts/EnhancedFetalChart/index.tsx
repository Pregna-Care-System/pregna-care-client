import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Col, message, Row, Select, Spin, Statistic, Tabs, Typography } from 'antd'
import Chart from 'react-apexcharts'
import { ShareAltOutlined } from '@ant-design/icons'
import html2canvas from 'html2canvas'
import ChartShareModal from '@/components/ChartShareModal'
import { useDispatch, useSelector } from 'react-redux'
import { selectTagInfo, selectUserInfo } from '@/store/modules/global/selector'

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface MetricResponse {
  currentValue: number
  minValue: number
  maxValue: number
}

interface ProcessedDataItem {
  metricName: string
  week: number
  metricResponseList: MetricResponse[]
}

export default function EnhancedFetalChart({
  fetalData,
  sharing
}: {
  fetalData: ProcessedDataItem[]
  sharing: boolean
}) {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectUserInfo)
  const tags = useSelector(selectTagInfo) || []
  const [loading, setLoading] = useState(false)
  const [processedData, setProcessedData] = useState<ProcessedDataItem[]>([])
  const chartRef = useRef<HTMLDivElement>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [chartImageUrl, setChartImageUrl] = useState('')
  const [processedChartData, setProcessedChartData] = useState<any>(null)

  useEffect(() => {
    if (Array.isArray(fetalData) && fetalData.length > 0) {
      setProcessedData(fetalData)
      setLoading(false)
    } else {
      setProcessedData([])
      setLoading(true)
    }
  }, [fetalData])

  // Get unique metric names for the dropdown
  const metricNames = useMemo(() => {
    const names = new Set<string>()
    if (Array.isArray(processedData)) {
      processedData.forEach((item) => names.add(item.metricName))
    }
    return Array.from(names)
  }, [processedData])

  // Set default selected metric to the first metric in the list
  const [selectedMetric, setSelectedMetric] = useState<string>(() => {
    return metricNames.length > 0 ? metricNames[0] : 'No metrics available'
  })

  // Update selectedMetric when metricNames changes
  useEffect(() => {
    if (metricNames.length > 0 && !metricNames.includes(selectedMetric)) {
      setSelectedMetric(metricNames[0])
    }
  }, [metricNames, selectedMetric])

  // Transform data for the selected metric
  const chartData = useMemo(() => {
    if (
      !selectedMetric ||
      selectedMetric === 'No metrics available' ||
      !Array.isArray(processedData) ||
      !processedData.some((item) => item.metricName === selectedMetric)
    )
      return []

    return processedData
      .filter((item) => item.metricName === selectedMetric)
      .sort((a, b) => a.week - b.week)
      .map((item) => {
        // Handle multiple measurements in a week by averaging them
        if (item.metricResponseList.length > 1) {
          const avgCurrent =
            item.metricResponseList.reduce(
              (acc: { sum: number; count: number }, resp: MetricResponse) => {
                acc.sum += resp.currentValue
                acc.count += 1
                return acc
              },
              { sum: 0, count: 0 }
            ).sum / item.metricResponseList.length
          return {
            week: item.week,
            currentValue: avgCurrent,
            minValue: item.metricResponseList[0].minValue,
            maxValue: item.metricResponseList[0].maxValue
          }
        }

        return {
          week: item.week,
          currentValue: item.metricResponseList[0]?.currentValue,
          minValue: item.metricResponseList[0]?.minValue,
          maxValue: item.metricResponseList[0]?.maxValue
        }
      })
  }, [selectedMetric, processedData])

  // Get units and range for the selected metric
  const getMetricUnit = (metricName: string) => {
    if (metricName.includes('Weight')) return 'g'
    if (metricName.includes('Length') || metricName.includes('Diameter')) return 'mm'
    if (metricName.includes('Circumference')) return 'mm'
    if (metricName.includes('Heart Rate')) return 'bpm'
    if (metricName.includes('Fluid')) return 'cm'
    return ''
  }

  const unit = getMetricUnit(selectedMetric)

  // Get current status based on latest measurement
  const getStatus = () => {
    if (!chartData.length) return { status: 'Unknown', color: '#8c8c8c' }

    const latest = chartData[chartData.length - 1]
    if (latest.currentValue < latest.minValue) {
      return { status: 'Below Normal Range', color: '#faad14' }
    } else if (latest.currentValue > latest.maxValue) {
      return { status: 'Above Normal Range', color: '#faad14' }
    } else {
      return { status: 'Within Normal Range', color: '#52c41a' }
    }
  }

  const { status, color } = getStatus()

  // Prepare data for ApexCharts - Line Chart
  const lineSeries = useMemo(() => {
    if (!chartData.length) return []

    return [
      {
        name: 'Current Value',
        type: 'line',
        data: chartData.map((item) => ({
          x: item.week,
          y: item.currentValue
        }))
      },
      {
        name: 'Minimum Normal',
        type: 'line',
        data: chartData.map((item) => ({
          x: item.week,
          y: item.minValue
        }))
      },
      {
        name: 'Maximum Normal',
        type: 'line',
        data: chartData.map((item) => ({
          x: item.week,
          y: item.maxValue
        }))
      }
    ]
  }, [chartData])

  // Prepare data for ApexCharts - Area Chart
  const areaSeries = useMemo(() => {
    if (!chartData.length) return []

    return [
      {
        name: 'Current Value',
        data: chartData.map((item) => ({
          x: item.week,
          y: item.currentValue
        }))
      },
      {
        name: 'Normal Range',
        data: chartData.map((item) => ({
          x: item.week,
          y: [item.minValue, item.maxValue]
        }))
      }
    ]
  }, [chartData])

  const lineChartOptions = {
    chart: {
      type: 'line' as const,
      height: 400,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    stroke: {
      curve: 'smooth' as const,
      width: [3, 2, 2],
      dashArray: [0, 5, 5]
    },
    colors: ['#1890ff', '#ff4d4f', '#ff4d4f'],
    fill: {
      type: ['solid', 'solid', 'solid'],
      opacity: [1, 0.3, 0.3]
    },
    xaxis: {
      title: {
        text: 'Gestational Age (weeks)'
      },
      type: 'numeric' as const
    },
    yaxis: {
      title: {
        text: `${selectedMetric} ${unit ? `(${unit})` : ''}`
      },
      labels: {
        formatter: (value: number) => value.toFixed(2)
      }
    },
    markers: {
      size: 4
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value.toFixed(2)} ${unit}`
      }
    },
    legend: {
      position: 'top' as const
    }
  }

  const areaChartOptions = {
    chart: {
      type: 'rangeArea' as const,
      height: 400,
      toolbar: {
        show: true
      }
    },
    stroke: {
      curve: 'smooth' as const,
      width: [3, 0]
    },
    colors: ['#1890ff', '#ff4d4f'],
    fill: {
      opacity: [0.2, 0.2]
    },
    xaxis: {
      title: {
        text: 'Gestational Age (weeks)'
      },
      type: 'numeric' as const
    },
    yaxis: {
      title: {
        text: `${selectedMetric} ${unit ? `(${unit})` : ''}`
      },
      labels: {
        formatter: (value: number) => value.toFixed(2)
      }
    },
    markers: {
      size: 4
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value.toFixed(2)} ${unit}`
      }
    },
    legend: {
      position: 'top' as const
    }
  }

  // Prepare chart data for sharing
  const prepareChartDataForSharing = () => {
    // Return the actual array instead of a JSON string
    return JSON.stringify(fetalData)
  }

  if (loading) {
    return (
      <Card className='w-full'>
        <div className='flex justify-center items-center h-[400px]'>
          <Spin size='large' tip='Loading fetal growth data...' />
        </div>
      </Card>
    )
  }

  return (
    <Card className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <Title level={4}>Fetal Growth Metrics</Title>
          <Text type='secondary'>Track fetal development measurements over time</Text>
        </div>
        {sharing && (
          <Button type='primary' icon={<ShareAltOutlined />}>
            Share Chart
          </Button>
        )}
      </div>

      <div className='my-4'>
        <Select
          style={{ width: '100%', maxWidth: 300 }}
          value={selectedMetric}
          onChange={setSelectedMetric}
          placeholder='Select a metric'
        >
          {metricNames.map((name) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div>

      {chartData.length > 0 && (
        <Row gutter={[16, 16]} className='mb-4'>
          <Col xs={24} md={8}>
            <Card size='small'>
              <Statistic
                title='Latest Value'
                value={chartData[chartData.length - 1].currentValue.toFixed(1)}
                suffix={unit}
                precision={1}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size='small'>
              <Statistic
                title='Normal Range'
                value={`${chartData[chartData.length - 1].minValue.toFixed(1)} - ${chartData[chartData.length - 1].maxValue.toFixed(1)}`}
                suffix={unit}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size='small'>
              <Statistic title='Status' value={status} valueStyle={{ color }} />
            </Card>
          </Col>
        </Row>
      )}

      <Tabs defaultActiveKey='line'>
        <TabPane tab='Line Chart' key='line'>
          <div style={{ height: 400 }} ref={chartRef}>
            {typeof window !== 'undefined' && chartData.length > 0 && (
              <Chart options={lineChartOptions} series={lineSeries} type='line' height={400} />
            )}

            {chartData.length === 0 && (
              <div className='flex items-center justify-center h-[300px] text-gray-500'>
                No data available for the selected metric
              </div>
            )}
          </div>
        </TabPane>
        <TabPane tab='Range Area Chart' key='area'>
          <div style={{ height: 400 }} ref={chartRef}>
            {typeof window !== 'undefined' && chartData.length > 0 && (
              <Chart options={areaChartOptions} series={areaSeries} type='rangeArea' height={400} />
            )}

            {chartData.length === 0 && (
              <div className='flex items-center justify-center h-[300px] text-gray-500'>
                No data available for the selected metric
              </div>
            )}
          </div>
        </TabPane>
      </Tabs>

      <ChartShareModal
        isVisible={isShareModalOpen}
        onCancel={() => setIsShareModalOpen(false)}
        onSubmit={(postData) => {
          // Handle the submission
          dispatch({
            type: 'CREATE_BLOG',
            payload: {
              ...postData,
              userId: currentUser?.id,
              featuredImageUrl: chartImageUrl || '',
              type: 'community',
              sharedChartData: prepareChartDataForSharing()
            },
            callback: (success: boolean) => {
              if (success) {
                message.success('Chart shared successfully!')
                setIsShareModalOpen(false)
              } else {
                message.error('Failed to share chart')
              }
            }
          })
        }}
        currentUser={currentUser}
        tags={tags || []}
        submitting={false}
        chartData={processedChartData}
      />
    </Card>
  )
}
