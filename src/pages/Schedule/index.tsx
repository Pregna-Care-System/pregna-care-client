import { useEffect, useState } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  getWeek
} from 'date-fns'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { selectReminderInfo, selectReminderTypeInfo } from '@/store/modules/global/selector'
import { Button, Form, Modal, Select, TimePicker } from 'antd'
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
const VIEW_TYPES = {
  MONTH: 'month',
  WEEK: 'week'
}

const SchedulePage = () => {
  const [viewType, setViewType] = useState(VIEW_TYPES.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [events, setEvents] = useState([])
  const dataSource = useSelector(selectReminderInfo)
  const typeResponse = useSelector(selectReminderTypeInfo)
  const [typeList, setTypeList] = useState([])
  const dispatch = useDispatch()
  const [currentEvent, setCurrentEvent] = useState(null)
  const [form] = Form.useForm()

  const getDaysInMonth = (date) => {
    const start = startOfWeek(startOfMonth(date))
    const end = endOfWeek(endOfMonth(date))
    return eachDayOfInterval({ start, end })
  }

  const navigateMonth = (direction) => {
    setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const days = getDaysInMonth(currentDate)

  const handleDateClickSmall = (date) => {
    setSelectedDate(date)
  }

  const handleKeyDown = (e, date) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedDate(date)
    }
  }

  useEffect(() => {
    dispatch({ type: 'GET_ALL_REMINDER_INFORMATION' })
    dispatch({ type: 'GET_ALL_REMINDER_TYPE_INFORMATION' })
  }, [dispatch])

  useEffect(() => {
    if (typeResponse !== null) {
      setTypeList(typeResponse)
    }
  }, [typeResponse])

  useEffect(() => {
    if (dataSource) {
      setEvents(dataSource)
    }
  }, [dataSource])

  const getDays = () => {
    if (viewType === VIEW_TYPES.WEEK) {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      return eachDayOfInterval({ start, end })
    } else {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      return eachDayOfInterval({ start, end })
    }
  }

  const handlePrevWeek = () => setCurrentDate((date) => new Date(date.setDate(date.getDate() - 7)))
  const handleNextWeek = () => setCurrentDate((date) => new Date(date.setDate(date.getDate() + 7)))
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleToday = () => setCurrentDate(new Date())

  const handleDateClick = (date) => {
    setSelectedDate(date)
    const eventOnDate = events.find((event) => isSameDay(dayjs(event.reminderDate).format('YYYY-MM-DD'), date))

    if (eventOnDate) {
      setCurrentEvent(eventOnDate)
      form.setFieldsValue({
        title: eventOnDate.title,
        reminderType: eventOnDate.reminderTypeId,
        reminderDate: dayjs(eventOnDate.reminderDate),
        startTime: dayjs(eventOnDate.startTime, 'HH:mm:ss'),
        endTime: dayjs(eventOnDate.endTime, 'HH:mm:ss'),
        description: eventOnDate.description,
        status: eventOnDate.status
      })
    } else {
      setCurrentEvent(null)
      form.resetFields()

      form.setFieldsValue({
        reminderDate: dayjs(date)
      })
    }

    setShowEventModal(true)
  }

  const handleAddEvent = () => {
    form.validateFields().then((values) => {
      console.log('SELECT DATE', values)
      const { reminderType, title, startTime, endTime, description, reminderDate, status } = values
      const newEventItem = {
        reminderTypeId: reminderType,
        title,
        description,
        reminderDate: dayjs(reminderDate).format('YYYY-MM-DD'),
        startTime: dayjs(startTime).format('HH:mm:ss'),
        endTime: dayjs(endTime).format('HH:mm:ss'),
        status
      }
      if (currentEvent) {
        dispatch({
          type: 'UPDATE_REMINDER',
          payload: {
            reminderTypeId: reminderType,
            title,
            description,
            reminderDate: dayjs(reminderDate).format('YYYY-MM-DD'),
            startTime: dayjs(startTime).format('HH:mm:ss'),
            endTime: dayjs(endTime).format('HH:mm:ss'),
            status,
            id: currentEvent.id
          }
        })
      } else {
        dispatch({ type: 'CREATE_REMINDER', payload: newEventItem })
      }

      setShowEventModal(false)
      form.resetFields()
    })
  }
  const handleEditEvent = (event) => {
    setCurrentEvent(event)
    form.setFieldsValue({
      title: event.title,
      reminderType: event.reminderTypeId,
      reminderDate: dayjs(event.reminderDate),
      startTime: dayjs(event.startTime, 'HH:mm:ss'),
      endTime: dayjs(event.endTime, 'HH:mm:ss'),
      description: event.description,
      status: event.status
    })
    setShowEventModal(true)
  }
  const handleDeleteEvent = (id) => {
    console.log('ID', id)
    Modal.confirm({
      title: 'Are you sure you want to delete this reminder?',
      content: 'Once deleted, this action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch({ type: 'DELETE_REMINDER', payload: id })
      },
      onCancel: () => {
        console.log('Deletion cancelled')
      }
    })
  }
  const EventModal = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-md'>
        <Form form={form} onFinish={handleAddEvent} layout='horizontal' className='space-y-4'>
          <h1 className='text-xl font-semibold mb-4 text-foreground dark:text-dark-foreground'>
            {currentEvent
              ? `Edit Event for ${format(selectedDate, 'MMMM d, yyyy')}`
              : `Add Event for ${format(selectedDate, 'MMMM d, yyyy')}`}
          </h1>
          <div>
            <Form.Item label='Title' name='title' rules={[{ required: true, message: 'Please enter event title!' }]}>
              <input
                type='text'
                placeholder='Event Title'
                className='w-full p-2 border rounded-md bg-background dark:bg-dark-background'
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name='reminderType'
              label='Event type'
              rules={[{ required: true, message: 'Please select one event type!' }]}
            >
              <Select
                placeholder='Select event type'
                options={typeList.map((type) => ({ label: type.typeName, value: type.id }))}
              />
            </Form.Item>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Form.Item
                label='Start Time'
                name='startTime'
                rules={[{ required: true, message: 'Please select start time!' }]}
              >
                <TimePicker format={'HH:mm:ss'} placeholder='Start Time' style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label='End Time'
                name='endTime'
                rules={[{ required: true, message: 'Please select end time!' }]}
              >
                <TimePicker placeholder='End Time' style={{ width: '100%' }} />
              </Form.Item>
            </div>
          </div>
          <div>
            <Form.Item name='status' label='Status'>
              <Select>
                <Select.Option value='ACTIVE'>🔵 Active</Select.Option>
                <Select.Option value='DONE'>🟢 Done</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div>
            <Form.Item label='Description' name='description'>
              <textarea
                placeholder='Event description'
                className='w-full p-2 border rounded-md bg-background dark:bg-dark-background'
              />
            </Form.Item>
          </div>
          <Form.Item name='reminderDate' hidden>
            <input value={dayjs(selectedDate).format('YYYY-MM-DD')} readOnly />
          </Form.Item>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={() => setShowEventModal(false)}
              className='px-4 py-2 rounded-md bg-secondary dark:bg-dark-secondary text-secondary-foreground dark:text-dark-secondary-foreground'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-black text-red-300 px-4 py-2 rounded-md bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground'
            >
              {currentEvent ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  )

  return (
    <div className='py-32' style={{ background: 'linear-gradient(to bottom,#f0f8ff, #f6e3e1 )' }}>
      <div className='flex justify-around'>
        <div>
          <div className='max-w-md mx-auto bg-card p-4 rounded-lg shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-foreground'>{format(currentDate, 'MMMM yyyy')}</h2>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={goToToday}
                  className='px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-opacity-90 transition-colors'
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('prev')}
                  className='p-2 hover:bg-secondary rounded-full transition-colors'
                >
                  <FiChevronLeft className='w-5 h-5' />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className='p-2 hover:bg-secondary rounded-full transition-colors'
                >
                  <FiChevronRight className='w-5 h-5' />
                </button>
              </div>
            </div>

            <div className='grid grid-cols-7 gap-1'>
              {daysOfWeek.map((day) => (
                <div key={day} className='text-center py-2 text-sm font-semibold text-muted-foreground'>
                  {day}
                </div>
              ))}

              {days.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isTodayDate = isToday(day)
                const isSelected = isSameDay(day, selectedDate)
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClickSmall(day)}
                    onKeyDown={(e) => handleKeyDown(e, day)}
                    className={`
                p-2 text-center text-sm rounded-full transition-all
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring
                ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                ${isTodayDate ? 'bg-blue-500 text-white': ''}
                ${isSelected ? 'bg-primary text-primary-foreground' : ''}
              `}
                    tabIndex={0}
                    aria-label={format(day, 'PPPP')}
                  >
                    {format(day, 'd')}
                  </button>
                )
              })}
            </div>
          </div>

          <h1 style={{ fontSize: '25px' , marginTop: '30px'}}>Upcoming Events</h1>
          <div className='max-h-[550px] overflow-y-auto scrollbar-custom border border-solid rounded-2xl shadow-md p-5 w-full mt-4 bg-white'>
            {dataSource.length > 0 ? (
              dataSource.map((event) => {
                const formattedDate = new Date(event.reminderDate).toLocaleDateString('en-CA')
                return (
                  <div
                    className={`border border-solid rounded-2xl shadow-md p-5 w-full mb-4 mt-4 ${
                      event.status === 'DONE' ? 'border-green-300' : 'border-red-200'
                    } bg-white`}
                    key={event.id}
                  >
                    <div className='flex justify-between'>
                      <strong>{event.title}</strong>
                      {event.status === 'DONE' && <span style={{ color: 'green', fontWeight: 'bold' }}>🟢</span>}
                    </div>
                    <div style={{ fontSize: '14px', color: 'gray' }}>
                      <ClockCircleOutlined /> {formattedDate} {event.startTime}
                    </div>

                    <Button style={{ marginRight: '10px' }} onClick={() => handleEditEvent(event)}>
                      View Details
                    </Button>
                    <Button
                      className='border-red-200 text-red-500'
                      type='danger'
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteEvent(event.id)}
                    ></Button>
                  </div>
                )
              })
            ) : (
              <p>No upcoming events.</p>
            )}
          </div>
        </div>
        <div className='w-2/3 h-2/3 p-2 mr-8 bg-gray-50'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex gap-2'>
              <button
                onClick={() => setViewType(VIEW_TYPES.MONTH)}
                className={`px-4 py-2 rounded-md ${viewType === VIEW_TYPES.MONTH ? 'bg-blue-300 text-white' : ' border border-solid border-gray-300'}`}
              >
                Month
              </button>
              <button
                onClick={() => setViewType(VIEW_TYPES.WEEK)}
                className={`px-4 py-2 rounded-md ${viewType === VIEW_TYPES.WEEK ? 'bg-blue-300 text-white' : 'border border-solid border-gray-300'}`}
              >
                Week
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between mb-8'>
            <h1 className='text-2xl font-bold text-foreground dark:text-dark-foreground'>
              {viewType === VIEW_TYPES.WEEK
                ? `Week ${getWeek(currentDate)} - ${format(currentDate, 'MMMM yyyy')}`
                : format(currentDate, 'MMMM yyyy')}
            </h1>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleToday}
                className='p-2 rounded-md bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground'
              >
                Today
              </button>
              <button
                onClick={viewType === VIEW_TYPES.WEEK ? handlePrevWeek : handlePrevMonth}
                className='p-2 rounded-md bg-secondary dark:bg-dark-secondary'
              >
                <FiChevronLeft className='w-5 h-5' />
              </button>
              <button
                onClick={viewType === VIEW_TYPES.WEEK ? handleNextWeek : handleNextMonth}
                className='p-2 rounded-md bg-secondary dark:bg-dark-secondary'
              >
                <FiChevronRight className='w-5 h-5' />
              </button>
            </div>
          </div>

          <div className='grid grid-cols-7 gap-1'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className='p-2 text-center font-semibold text-foreground dark:text-dark-foreground'>
                {day}
              </div>
            ))}
            {getDays().map((date, index) => {
              const dayEvents = events.filter((event) =>
                isSameDay(dayjs(event.reminderDate).format('YYYY-MM-DD'), date)
              )
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`p-2 h-24 border rounded-md transition-all ${isToday(date) ? 'bg-accent dark:bg-dark-accent text-accent-foreground dark:text-dark-accent-foreground' : ''} ${!isSameMonth(date, currentDate) ? 'opacity-50' : ''} ${isSameDay(date, selectedDate) ? 'ring-2 ring-primary dark:ring-dark-primary' : ''} hover:bg-muted dark:hover:bg-dark-muted`}
                >
                  <div className='flex flex-col h-full'>
                    <span className='text-sm'>{format(date, 'd')}</span>
                    {dayEvents.length > 0 && (
                      <div className='mt-1 space-y-1 overflow-hidden max-h-12 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
                        {dayEvents.map((event, i) => (
                          <div
                            key={i}
                            className=' border border-solid border-gray-300 bg-red-200 shadow-2xl text-xs p-1 bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground rounded truncate'
                          >
                            {event.title}
                            {event.status === 'DONE' && <span style={{ color: 'green', fontWeight: 'bold' }}>🟢</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {showEventModal && <EventModal />}
    </div>
  )
}

export default SchedulePage
