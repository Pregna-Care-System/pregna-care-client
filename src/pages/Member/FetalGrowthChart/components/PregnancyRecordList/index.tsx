import React, { useState } from 'react'
import { Card, Avatar, Tabs, Collapse, Progress, Badge } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FileTextOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons'
import ROUTES from '@/utils/config/routes'

interface PregnancyRecord {
  id: string
  babyName: string
  gestationalAge: number
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

const WeeklyProgressContent: React.FC<{ record: PregnancyRecord }> = ({ record }) => {
  const weeklyData: WeeklyProgress[] = [
    { week: 1, status: 'process' },
    { week: 2, status: 'process' },
    { week: 3, status: 'success' },
    { week: 4, status: 'success' },
    { week: 5, status: 'success' },
    { week: 6, status: 'success' }
  ]

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <span className='text-lg font-medium'>Baby name: {record.babyName}</span>
        <Progress percent={30} size='small' style={{ width: 100 }} />
      </div>

      <Collapse className='bg-white rounded-lg'>
        {weeklyData.map((week) => (
          <Panel
            key={week.week}
            header={`Week: ${week.week}`}
            extra={
              <div className='flex items-center gap-2'>
                {week.status === 'process' ? (
                  <>
                    <Badge icon={<SyncOutlined spin />} text='process' status='processing' className='mr-2' />
                    <FileTextOutlined className='text-red-500' />
                  </>
                ) : (
                  <Badge icon={<CheckCircleOutlined />} text='success' status='success' />
                )}
              </div>
            }
          >
            <div className='p-2'>{week.content || `Content for week ${week.week}`}</div>
          </Panel>
        ))}
      </Collapse>
    </div>
  )
}

const PregnancyRecordList: React.FC<PregnancyRecordListProps> = ({ records }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(records[0]?.id)

  return (
    <div className='pregnancy-record-list'>
      <Tabs
        defaultActiveKey={activeTab}
        tabPosition='left'
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
                <p className='text-gray-600 text-sm'>Gestational Age: {record.gestationalAge} weeks</p>
                <p className='text-gray-600 text-sm'>Last Checkup: {record.lastCheckupDate}</p>
              </div>
            </Card>
          ),
          children: <WeeklyProgressContent record={record} />
        }))}
      />
    </div>
  )
}

export default PregnancyRecordList
