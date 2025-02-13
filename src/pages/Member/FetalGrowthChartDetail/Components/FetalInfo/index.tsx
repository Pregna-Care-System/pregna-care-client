import type React from 'react'
import { Card, Statistic, Tooltip, Divider } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

interface FetusInfoProps {
  data: {
    gestationalAge: number
    estimatedWeight: number
    headCircumference: number
    abdominalCircumference: number
    femurLength: number
    dueDate: string
  }
}

const FetusInfo: React.FC<FetusInfoProps> = ({ data }) => {
  const getStatus = (value: number, min: number, max: number) => {
    if (value < min) return 'yellow'
    if (value > max) return 'red'
    return 'green'
  }

  const weightStatus = getStatus(data.estimatedWeight, 1000, 1400)
  const hcStatus = getStatus(data.headCircumference, 25, 28)
  const acStatus = getStatus(data.abdominalCircumference, 22, 25)
  const flStatus = getStatus(data.femurLength, 4.8, 5.5)

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <Card title='General Information' className='shadow-md'>
        <Statistic title='Gestational Age' value={`${data.gestationalAge} weeks`} className='mb-4' />
        <Statistic title='Due Date' value={data.dueDate} />
      </Card>
      <Card title='Fetal Measurements' className='shadow-md'>
        <div className='grid grid-cols-2 gap-4'>
          <Tooltip title='Normal range: 1000g - 1400g'>
            <Statistic
              title={
                <span>
                  Estimated Weight <InfoCircleOutlined className='text-gray-400 ml-1' />
                </span>
              }
              value={data.estimatedWeight}
              suffix='g'
              valueStyle={{ color: weightStatus }}
            />
          </Tooltip>
          <Tooltip title='Normal range: 25cm - 28cm'>
            <Statistic
              title={
                <span>
                  Head Circumference <InfoCircleOutlined className='text-gray-400 ml-1' />
                </span>
              }
              value={data.headCircumference}
              suffix='cm'
              valueStyle={{ color: hcStatus.replace('text-', '') }}
            />
          </Tooltip>
          <Tooltip title='Normal range: 22cm - 25cm'>
            <Statistic
              title={
                <span>
                  Abdominal Circumference <InfoCircleOutlined className='text-gray-400 ml-1' />
                </span>
              }
              value={data.abdominalCircumference}
              suffix='cm'
              valueStyle={{ color: acStatus.replace('text-', '') }}
            />
          </Tooltip>
          <Tooltip title='Normal range: 4.8cm - 5.5cm'>
            <Statistic
              title={
                <span>
                  Femur Length <InfoCircleOutlined className='text-gray-400 ml-1' />
                </span>
              }
              value={data.femurLength}
              suffix='cm'
              valueStyle={{ color: flStatus.replace('text-', '') }}
            />
          </Tooltip>
        </div>
        <Divider className='my-4' />
        <div className='flex justify-end space-x-4'>
          <span className='text-green-500'>● Normal</span>
          <span className='text-yellow-500'>● Low</span>
          <span className='text-red-500'>● High</span>
        </div>
      </Card>
    </div>
  )
}

export default FetusInfo
