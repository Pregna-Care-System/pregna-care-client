'use client'

import type React from 'react'
import { useEffect, useState, useRef } from 'react'
import { Avatar, Button, Card, Form, Pagination, Progress, Spin, Tag, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CalendarOutlined, EditOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons'
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
  const [activeCard, setActiveCard] = useState(records[0].id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [form] = Form.useForm()
  const babyCardsContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Add a new state for tracking submission loading
  const [submitting, setSubmitting] = useState(false)

  const pageSize = 10 // Number of weeks per page
  const growthMetrics = useSelector(selectGrowthMetricsOfWeek) || []
  const user = useSelector(selectUserInfo)
  const fetalGrowthRecord = useSelector(selectFetalGrowthRecord)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeCard) {
      dispatch({ type: 'GET_FETAL_GROWTH_RECORDS', payload: { pregnancyRecordId: activeCard } })
    }
  }, [activeCard])

  // Handle mouse wheel horizontal scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (babyCardsContainerRef.current && e.deltaY !== 0) {
      // Prevent the default vertical scroll
      e.preventDefault()

      // Scroll horizontally instead
      babyCardsContainerRef.current.scrollLeft += e.deltaY
    }
  }

  // Handle mouse down for drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (babyCardsContainerRef.current) {
      setIsDragging(true)
      setStartX(e.pageX - babyCardsContainerRef.current.offsetLeft)
      setScrollLeft(babyCardsContainerRef.current.scrollLeft)
    }
  }

  // Handle mouse move for drag scrolling
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    if (babyCardsContainerRef.current) {
      const x = e.pageX - babyCardsContainerRef.current.offsetLeft
      const walk = (x - startX) * 2 // Scroll speed multiplier
      babyCardsContainerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  // Handle mouse up and mouse leave for drag scrolling
  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  const handleSubmit = (values: any) => {
    setSubmitting(true)

    const week = form.getFieldValue('week')
    const weekData = Array.isArray(fetalGrowthRecord) ? fetalGrowthRecord.filter((r: any) => r.week === week) : []

    const hasExistingData = weekData.length > 0

    if (hasExistingData) {
      // Handle updates - create an array of update operations
      const updatePromises = Object.entries(values)
        .filter(([key]) => !key.includes('_id') && key !== 'week' && key !== 'userId')
        .map(async ([key, value]) => {
          // Get the ID of this particular record if it exists
          const recordId = form.getFieldValue(`${key}_id`)
          const existingRecord = weekData.find((r: any) => r.name === key)

          // Only update if record exists AND the value has changed
          if (existingRecord && recordId && existingRecord.value !== value) {
            // Update existing record
            return dispatch({
              type: 'UPDATE_FETAL_GROWTH_RECORD',
              payload: {
                apiCallerId: 'updateFetalGrowth',
                fetalGrowthRecordId: recordId,
                name: key,
                value: value as string,
                week: week,
                unit: existingRecord.unit || '',
                description: existingRecord.description || '',
                note: ''
              }
            })
          } else if (!existingRecord) {
            // Create new record only if it doesn't exist
            return dispatch({
              type: 'CREATE_FETAL_GROWTH_RECORD',
              payload: {
                pregnancyRecordId: activeCard,
                createFetalGrowthRecordEntities: [
                  {
                    name: key,
                    value: value as string
                  }
                ],
                week: week,
                userId: user.id
              }
            })
          } else {
            // No change needed, return resolved promise to keep the Promise.all working
            return Promise.resolve()
          }
        })

      // Filter out undefined promises (where no update was needed)
      const filteredPromises = updatePromises.filter(Boolean)

      // If there are no changes, just close the modal
      if (filteredPromises.length === 0) {
        setSubmitting(false)
        setIsModalOpen(false)
        return
      }

      // Execute all operations and handle the results
      Promise.all(filteredPromises)
        .then(() => {
          setSubmitting(false)
          setIsModalOpen(false)

          // Refresh data after all updates complete
          dispatch({
            type: 'GET_FETAL_GROWTH_RECORDS',
            payload: { pregnancyRecordId: activeCard }
          })
        })
        .catch((error) => {
          console.error('Error updating records:', error)
          setSubmitting(false)
        })
    } else {
      // Handle new records - existing implementation
      const payload = {
        pregnancyRecordId: activeCard,
        createFetalGrowthRecordEntities: Object.entries(values)
          .filter(([key]) => !key.includes('_id') && key !== 'userId' && key !== 'week')
          .map(([key, value]) => ({
            name: key,
            value: value as string
          })),
        week: week,
        userId: user.id
      }

      dispatch({
        type: 'CREATE_FETAL_GROWTH_RECORD',
        payload,
        callback: (success: boolean) => {
          setSubmitting(false)
          if (success) {
            setIsModalOpen(false)
            dispatch({
              type: 'GET_FETAL_GROWTH_RECORDS',
              payload: { pregnancyRecordId: activeCard }
            })
          }
        }
      })
    }
  }

  const handleOpenModal = (week: number, e: React.MouseEvent) => {
    e.stopPropagation()

    // Get metrics available for this week
    dispatch({
      type: 'GET_ALL_GROWTH_METRICS_OF_WEEK',
      payload: { week }
    })

    // Set week in form
    form.setFieldValue('week', week)

    // Check if we have existing data for this week
    if (Array.isArray(fetalGrowthRecord)) {
      const weekData = fetalGrowthRecord.filter((r: any) => r.week === week)

      // Reset form first to clear previous values
      form.resetFields(['week'])
      form.setFieldValue('week', week)

      // If we have data, populate the form fields
      if (weekData.length > 0) {
        const formValues: Record<string, string> = {}

        // Create an object with values keyed by metric name
        weekData.forEach((item: any) => {
          formValues[item.name] = item.value
          // Store record ID for updating
          form.setFieldValue(`${item.name}_id`, item.id)
        })

        // Set all form values
        form.setFieldsValue(formValues)
      }
    }

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

            // Check if fetalGrowthRecord is an array before using filter
            const weekData = Array.isArray(fetalGrowthRecord)
              ? fetalGrowthRecord.filter((r: any) => r.week === weekNumber)
              : []

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
                  {status === 'process' ? (
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={(e) => handleOpenModal(weekNumber, e)}
                      className={styles.addButton}
                    >
                      Add
                    </Button>
                  ) : (
                    weekData.length > 0 && (
                      <Button
                        type='primary'
                        icon={<EditOutlined />}
                        onClick={(e) => handleOpenModal(weekNumber, e)}
                        className={styles.editButton}
                      >
                        Edit
                      </Button>
                    )
                  )}
                  <Button
                    type='default'
                    icon={<EyeOutlined />}
                    onClick={(e) => handleOpenDetailModal(weekNumber, e)}
                    className={weekData.length > 0 ? styles.detailsButtonActive : styles.detailsButton}
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          className={styles.babyCardsContainer}
          ref={babyCardsContainerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
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
        onClose={() => {
          // Don't allow closing while submitting
          if (!submitting) {
            setIsModalOpen(false)
          }
        }}
        formItem={growthMetrics.map((item: any) => ({
          name: item.name,
          label: item.name,
          message: item.message
        }))}
        handleSubmit={handleSubmit}
        form={form}
        loading={submitting} // Pass the submitting state to the modal
      />

      {selectedWeek && (
        <WeekDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          weekData={
            Array.isArray(fetalGrowthRecord) ? fetalGrowthRecord.filter((r: any) => r.week === selectedWeek) : []
          }
          weekNumber={selectedWeek}
          onEdit={handleEditFromDetail}
          status={getWeekStatus(activeRecord?.gestationalAgeResponse?.weeks || 0, selectedWeek)}
        />
      )}
    </div>
  )
}

export default PregnancyRecordList
