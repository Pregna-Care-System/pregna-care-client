import React from 'react'
import { Card, Calendar, Badge, Tooltip, theme } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import ListComponent from '../List'

interface ScheduleItem {
  date: string
  description: string
}

interface ScheduleCardProps {
  scheduleData: ScheduleItem[]
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ scheduleData }) => {
  const getListData = (value: Dayjs) => {
    const dateString = value.format('YYYY-MM-DD')
    return scheduleData.filter((item) => item.date === dateString)
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value)
    return (
      <>
        {listData.map((item, index) => (
          <Tooltip key={index} title={item.description}>
            <Badge status='warning' />
          </Tooltip>
        ))}
      </>
    )
  }

  const cellRender = (current: Dayjs, info: any) => {
    if (info.type === 'date') return dateCellRender(current)
    return info.originNode
  }

  const { token } = theme.useToken()

  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG
  }

  const disabledDate = (current: Moment): boolean => {
    // Disable all dates for selection
    return true
  }

  return (
    <Card
      title={
        <div>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Prenatal Examination Schedule
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={wrapperStyle}>
        <Calendar fullscreen={false} cellRender={cellRender} />
      </div>
      <p>Up comming</p>
      <ListComponent />
    </Card>
  )
}

export default ScheduleCard
