import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Card, Avatar, Tabs, Collapse, Progress, Badge, Button, Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FileTextOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons'
import ROUTES from '@/utils/config/routes'
import { CreateModal } from '@/components/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { selectGrowthMetricsOfWeek, selectUserInfo } from '@/store/modules/global/selector'

interface PregnancyRecord {
  id: string
  babyName: string
  gestationalAgeResponse: []
  lastCheckupDate: string
}

interface WeeklyProgress {
  week: number
  status: 'process' | 'success'
  content?: string
}

interface PregnancyRecordListProps {
  records: PregnancyRecord[]
}

const { Panel } = Collapse

const PregnancyRecordList: React.FC<PregnancyRecordListProps> = ({ records }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(records[0]?.id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const growthMetrics = useSelector(selectGrowthMetricsOfWeek) || []
  const user = useSelector(selectUserInfo)

  useEffect(() => {
    dispatch({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: user.id } })
  }, [])

  const fetusRecordFormItem = [
    ...growthMetrics.map((item: any) => ({
      name: item.name,
      label: item.name,
      message: item.message
    })),
    {
      name: 'week',
      label: 'Week',
      type: 'number',
      hidden: true // Hide the field but keep the value
    }
  ]

  const handleSubmit = (values: any) => {
    const payload = {
      pregnancyRecordId: activeTab,
      fetalGrowthRecords: Object.entries(values)
        .filter(([key]) => key !== 'userId' && key !== 'week')
        .map(([key, value]) => ({
          name: key,
          value: value as string
        })),
      week: form.getFieldValue('week'),
      userId: user.id
    }
    dispatch({ type: 'CREATE_FETAL_GROWTH_RECORD', payload })
    setIsModalOpen(false)
  }

  const handleOpenModal = (week: number) => {
    dispatch({
      type: 'GET_ALL_GROWTH_METRICS_OF_WEEK',
      payload: { week: week }
    })
    form.setFieldValue('week', week) // Pre-populate week
    setIsModalOpen(true)
  }

  const WeeklyProgressContent: React.FC<{ record: PregnancyRecord }> = ({ record }) => {
    const weeklyData: WeeklyProgress[] = Array.from({ length: record?.totalWeeks }, (_, i) => ({
      week: i + 1,
      status: 'process'
    }))

    return (
      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <span className='text-lg font-medium'>Baby name: {record.babyName}</span>
          <Progress percent={30} size='small' style={{ width: 100 }} />
        </div>
        <div className='overflow-y-auto' style={{ maxHeight: 650 }}>
          <Collapse className='bg-white rounded-lg'>
            {weeklyData.map((week) => (
              <Panel
                key={week.week}
                header={`Week: ${week.week}`}
                extra={
                  <div className='flex items-center gap-2'>
                    {week.status === 'process' ? (
                      <>
                        <Button
                          type='link'
                          className='text-red-500 p-0'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenModal(week.week) // Pass both ID and week number
                          }}
                        >
                          <FileTextOutlined className='text-red-500' />
                        </Button>
                        <Badge dot={<SyncOutlined spin />} text='process' status='processing' />
                      </>
                    ) : (
                      <Badge dot={<CheckCircleOutlined />} text='success' status='success' />
                    )}
                  </div>
                }
              ></Panel>
            ))}
          </Collapse>
        </div>
      </div>
    )
  }

  return (
    <div className='pregnancy-record-list'>
      <Tabs
        defaultActiveKey={activeTab}
        tabPosition='left'
        onChange={(key) => setActiveTab(key)}
        items={records.map((record: PregnancyRecord) => ({
          key: record.id,
          label: (
            <Card hoverable className='h-full w-[240px]'>
              <div className='flex flex-col items-center'>
                <Avatar
                  size={80}
                  src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736848318/PregnaCare/oa3zuazyvqgi2y9ef7ec.png'
                  className='mb-2 border border-red-200'
                  style={{ borderRadius: '50%' }}
                />
                <h3 className='text-lg font-semibold mb-2'>{record.babyName}</h3>
                <p className='text-gray-600 text-sm font-light'>
                  Gestational Age: {record.gestationalAgeResponse?.weeks} weeks
                </p>
                <p className='text-gray-600 text-sm font-light'>
                  Estimated Due Date: {dayjs(record.gestationalAgeResponse?.estimatedDueDate).format('DD-MM-YYYY')}
                </p>
                <Button
                  type='primary'
                  className='mt-4'
                  onClick={() =>
                    navigate(ROUTES.MEMBER.FETALGROWTHCHART_DETAIL.replace(':pregnancyRecordId', record.id))
                  }
                >
                  View Chart
                </Button>
              </div>
            </Card>
          ),
          children: <WeeklyProgressContent record={record} />
        }))}
      />
      <CreateModal
        isOpen={isModalOpen}
        title='Create Pregnancy Record'
        onClose={() => setIsModalOpen(false)}
        formItem={fetusRecordFormItem}
        handleSubmit={handleSubmit}
        form={form}
      />
    </div>
  )
}

export default PregnancyRecordList
