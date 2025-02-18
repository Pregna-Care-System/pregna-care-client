import React from 'react'
import { Card, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'

interface PregnancyRecord {
  id: string
  babyName: string
  gestationalAge: number
  lastCheckupDate: string
}

interface PregnancyRecordListProps {
  records: PregnancyRecord[]
}

const PregnancyRecordList: React.FC<PregnancyRecordListProps> = ({ records }) => {
  const navigate = useNavigate()

  const handleCardClick = (id: string) => {
    navigate(`${ROUTES.MEMBER.FETALGROWTHCHART}/${id}`)
  }

  return (
    <Row gutter={[16, 16]}>
      {records.map((record) => (
        <Col xs={24} sm={12} md={8} lg={6} key={record.id}>
          <Card hoverable className='h-full' onClick={() => handleCardClick(record.id)}>
            <h3 className='text-lg font-semibold mb-2'>{record.babyName}</h3>
            <p className='text-gray-600'>Gestational Age: {record.gestationalAge} weeks</p>
            <p className='text-gray-600'>Last Checkup: {record.lastCheckupDate}</p>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default PregnancyRecordList
