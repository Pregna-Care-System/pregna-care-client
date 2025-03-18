import type React from 'react'
import { useEffect, useState } from 'react'
import { Card, Avatar, Progress, Button, Form, Spin, Tooltip, Pagination, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { HeartOutlined, EditOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import ROUTES from '@/utils/config/routes'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.css'
import { selectFetalGrowthRecord, selectGrowthMetricsOfWeek, selectUserInfo } from '@/store/modules/global/selector'
import WeekDetailModal from '../WeekDetailModal'
import { CreateModal } from '../Modal'

interface PregnancyRecord {
  id: string
  babyName: string
  babyGender: string
  gestationalAgeResponse: {
    weeks: number
    estimatedDueDate: string
  }
  totalWeeks: number
  lastCheckupDate: string
}

const PregnancyRecordList: React.FC<{ records: PregnancyRecord[] }> = ({ records }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeCard, setActiveCard] = useState(records[0]?.id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [form] = Form.useForm()

  const pageSize = 10 // Number of weeks per page
  const growthMetrics = useSelector(selectGrowthMetricsOfWeek) || []
  const user = useSelector(selectUserInfo)
  const fetalGrowthRecord = useSelector(selectFetalGrowthRecord)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeCard) {
      dispatch({ type: 'GET_FETAL_GROWTH_RECORDS', payload: { pregnancyRecordId: activeCard } })
    }
  }, [activeCard, dispatch])

  const handleSubmit = (values: any) => {
    const payload = {
      pregnancyRecordId: activeCard,
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

  const handleOpenModal = (week: number, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'GET_ALL_GROWTH_METRICS_OF_WEEK',
      payload: { week }
    })
    form.setFieldValue('week', week)
    setIsModalOpen(true)
  }

  const getWeekStatus = (currentWeek: number, weekNumber: number) => {
    if (weekNumber < currentWeek) return 'success'
    if (weekNumber === currentWeek) return 'process'
    return 'waiting'
  }

  const handleOpenDetailModal = (week: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedWeek(week)
    setIsDetailModalOpen(true)
  }

  const handleEditFromDetail = (week: number) => {
    setIsDetailModalOpen(false)
    handleOpenModal(week)
  }

  const getStatusTag = (status: 'success' | 'process' | 'waiting') => {
    switch (status) {
      case 'success':
        return (
          <Tag color='success' className={styles.statusTag}>
            Completed
          </Tag>
        )
      case 'process':
        return (
          <Tag color='processing' className={styles.statusTag}>
            Current Week
          </Tag>
        )
      default:
        return <Tag className={styles.statusTag}>Upcoming</Tag>
    }
  }

  const WeekGrid: React.FC<{ record: PregnancyRecord }> = ({ record }) => {
    const currentWeek = record.gestationalAgeResponse?.weeks || 0
    const totalWeeks = record.totalWeeks || 40

    // Calculate pagination
    const startWeek = (currentPage - 1) * pageSize + 1
    const endWeek = Math.min(currentPage * pageSize, totalWeeks)
    const weeks = Array.from({ length: endWeek - startWeek + 1 }, (_, i) => startWeek + i)

    return (
      <div className={styles.weekGridContainer}>
        <div className={`${styles.weekGrid} grid grid-cols-5 gap-4`}>
          {weeks.map((weekNumber) => {
            const status = getWeekStatus(currentWeek, weekNumber)
            const weekData = fetalGrowthRecord.filter((r: any) => r.week === weekNumber)

            return (
              <Card key={weekNumber} className={`${styles.weekCard} ${styles[status]}`} bordered={false}>
                <div className={styles.weekCardHeader}>
                  <div className={styles.weekInfo}>
                    <span className={styles.weekNumber}>Week {weekNumber}</span>
                    {getStatusTag(status)}
                  </div>
                </div>

                <div className={styles.weekCardContent}>
                  {weekData.length > 0 ? (
                    <div className={styles.weekDataPreview}>
                      {weekData.slice(0, 2).map((data: any) => (
                        <Tooltip key={data.id} title={`${data.name}: ${data.value} ${data.unit}`}>
                          <span className={styles.dataPoint}>
                            {data.name}: {data.value}
                          </span>
                        </Tooltip>
                      ))}
                      {weekData.length > 2 && <span className={styles.moreData}>+{weekData.length - 2} more</span>}
                    </div>
                  ) : (
                    <div className={styles.noDataMessage}>No records yet</div>
                  )}
                </div>

                <div className={styles.weekCardActions}>
                  {status === 'process' && (
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={(e) => handleOpenModal(weekNumber, e)}
                      className={styles.actionButton}
                    >
                      Add
                    </Button>
                  )}
                  <Button
                    type={weekData.length > 0 ? 'primary' : 'default'}
                    icon={<EyeOutlined />}
                    onClick={(e) => handleOpenDetailModal(weekNumber, e)}
                    className={styles.actionButton}
                  >
                    Details
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
        <div className={styles.pagination}>
          <Pagination
            current={currentPage}
            total={totalWeeks}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size='large' />
      </div>
    )
  }

  const activeRecord = records.find((record) => record.id === activeCard)
  const progressPercent = activeRecord
    ? Math.round((activeRecord.gestationalAgeResponse?.weeks / activeRecord.totalWeeks) * 100)
    : 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.babyCards}>
          {records.map((record) => (
            <Card
              key={record.id}
              className={`${styles.recordCard} ${activeCard === record.id ? styles.activeCard : ''}`}
              onClick={() => {
                setActiveCard(record.id)
                setCurrentPage(1) // Reset pagination when switching babies
              }}
            >
              <div className={styles.cardContent}>
                <Avatar
                  size={90}
                  src='https://res.cloudinary.com/drcj6f81i/image/upload/v1740588447/PregnaCare/ypdcsuzin5hbi37lquec.jpg'
                  className={styles.avatar}
                />
                <div className={styles.babyInfo}>
                  <h3 className={styles.babyName}>
                    <HeartOutlined /> {record.babyName} - {record.babyGender}
                  </h3>
                  <p className={styles.gestationalInfo}>Week {record.gestationalAgeResponse?.weeks}</p>
                  <p className={styles.dueDate}>
                    <CalendarOutlined /> {dayjs(record.gestationalAgeResponse?.estimatedDueDate).format('DD-MM-YYYY')}
                  </p>
                  <div className='flex items-center justify-end mt-2'>
                    <Button
                      type='primary'
                      className={styles.viewButton}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(ROUTES.MEMBER.FETALGROWTHCHART_DETAIL.replace(':pregnancyRecordId', record.id))
                      }}
                    >
                      View Chart
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {activeRecord && (
          <div className={styles.progressSection}>
            <Progress
              type='circle'
              percent={Math.round((activeRecord.gestationalAgeResponse?.weeks / activeRecord.totalWeeks) * 100)}
              size={80}
              strokeColor='#ff6b81'
            />
            <div className={styles.progressInfo}>
              <h3>Progress</h3>
              <p>
                Week {activeRecord.gestationalAgeResponse?.weeks} of {activeRecord.totalWeeks}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.content}>{activeRecord && <WeekGrid record={activeRecord} />}</div>

      <CreateModal
        isOpen={isModalOpen}
        title='Add Weekly Record'
        onClose={() => setIsModalOpen(false)}
        formItem={growthMetrics.map((item: any) => ({
          name: item.name,
          label: item.name,
          message: item.message
        }))}
        handleSubmit={handleSubmit}
        form={form}
      />

      {selectedWeek && (
        <WeekDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          weekData={fetalGrowthRecord.filter((r: any) => r.week === selectedWeek)}
          weekNumber={selectedWeek}
          onEdit={handleEditFromDetail}
          status={getWeekStatus(activeRecord?.gestationalAgeResponse?.weeks || 0, selectedWeek)}
        />
      )}
    </div>
  )
}

export default PregnancyRecordList
