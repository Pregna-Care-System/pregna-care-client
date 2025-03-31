import { useEffect, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { selectReminderInfo, selectReminderTypeInfo, selectUserInfo } from '@/store/modules/global/selector'
import { Button, Checkbox, DatePicker, Dropdown, Form, Menu, Modal, Select, TimePicker } from 'antd'
import { ClockCircleOutlined, DeleteOutlined, EllipsisOutlined, PlusCircleFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter)

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
  const user = useSelector(selectUserInfo)
  const [showMoreEventsModal, setShowMoreEventsModal] = useState(false)
  const [moreEventsDate, setMoreEventsDate] = useState(null)
  const [isCreateButtonMode, setIsCreateButtonMode] = useState(false)
  const [selectedTypeEvents, setSelectedTypeEvents] = useState([])
  const [selectedTypeName, setSelectedTypeName] = useState()

  const getEventColor = (typeName) => {
    const typeColors = {
      'Prenatal Checkup Reminder': 'bg-blue-100 border-blue-500 text-blue-800',
      'Medical Test Reminder': 'bg-green-100 border-green-500 text-green-800',
      'Supplement Intake Reminder': 'bg-orange-100 border-yellow-500 text-yellow-800',
      default: 'bg-gray-100 border-gray-500 text-gray-800'
    }
    return typeColors[typeName] || typeColors['default']
  }

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
  const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }
  useEffect(() => {
    dispatch({ type: 'GET_ALL_REMINDER_INFORMATION_BY_USER_iD', payload: user.id })
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

    // if have reminder -> permit edit
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
      setIsCreateButtonMode(false)
      setShowEventModal(true)
    }
    // if the past =>  Cannot create new
    else if (dayjs(date).isBefore(dayjs(), 'day')) {
      Modal.warning({
        title: 'Cannot Select Past Date',
        content: 'You cannot select past dates.'
      })
    }
    // if future => create new
    else {
      setCurrentEvent(null)
      form.resetFields()
      form.setFieldsValue({
        reminderDate: dayjs(date)
      })
      setIsCreateButtonMode(false)
      setShowEventModal(true)
    }
  }

  const handleAddEvent = () => {
    form.validateFields().then((values) => {
      const { reminderType, title, startTime, endTime, description, reminderDate, status } = values
      const newEventItem = {
        userId: user.id,
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
    setSelectedDate(dayjs(event.reminderDate).toDate())
    form.setFieldsValue({
      title: event.title,
      reminderType: event.reminderTypeId,
      reminderDate: dayjs(event.reminderDate),
      startTime: dayjs(event.startTime, 'HH:mm:ss'),
      endTime: dayjs(event.endTime, 'HH:mm:ss'),
      description: event.description,
      status: event.status
    })
    setShowMoreEventsModal(false)
    setShowEventModal(true)
  }
  const handleTypeClick = (type) => {
    const typeEvents = events.filter((event) => event.reminderTypeId === type.id) || []
    setMoreEventsDate(null)
    setSelectedTypeEvents(typeEvents)
    setSelectedTypeName(type.typeName)
    setShowMoreEventsModal(true)
  }
  const handleDeleteEvent = (id) => {
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
  const EventModal = () => {
    // Validate date not in past
    const validateDate = (_, value) => {
      if (value && value.isBefore(dayjs(), 'day')) {
        return Promise.reject('Date cannot be in the past!')
      }
      return Promise.resolve()
    }

    // Validate time not in past (for the selected date)
    const validateTime = (fieldName) => (_, value) => {
      if (!value) return Promise.resolve()

      const selectedDate = form.getFieldValue('reminderDate')
      const currentDateTime = dayjs()

      // If date is today, check time
      if (selectedDate && selectedDate.isSame(currentDate, 'day')) {
        if (value.isBefore(currentDateTime, 'minute')) {
          return Promise.reject(`${fieldName} cannot be in the past!`)
        }
      }
      return Promise.resolve()
    }
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-md'>
          <Form form={form} onFinish={handleAddEvent} layout='horizontal' className='space-y-4'>
            <h1 className='text-2xl font-semibold mb-4 text-[#ff6b81]'>
              {isCreateButtonMode
                ? 'Create Reminder'
                : currentEvent
                  ? `Edit Reminder for ${format(selectedDate, 'MMMM d, yyyy')}`
                  : `Add Reminder for ${format(selectedDate, 'MMMM d, yyyy')}`}
            </h1>
            <div>
              <Form.Item 
                label='Title' 
                name='title' 
                rules={[
                  { required: true, message: 'Please enter event title!' },
                  { min: 5, message: 'Title must be at least 5 characters' },
                  { max: 100, message: 'Title cannot exceed 100 characters!' }
                ]}
              >
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
                label='Reminder type'
                rules={[{ required: true, message: 'Please select one event type!' }]}
              >
                <Select
                  placeholder='Select event type'
                  options={typeList.map((type) => ({ label: type.typeName, value: type.id }))}
                />
              </Form.Item>
            </div>

            {isCreateButtonMode && (
              <Form.Item
                label='Event Date'
                name='reminderDate'
                rules={[{ required: true, message: 'Please select event date!' }, { validator: validateDate }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Form.Item
                  label='Start Time'
                  name='startTime'
                  rules={[
                    { required: true, message: 'Please select start time!' },
                    { validator: validateTime('Start time') },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!getFieldValue('endTime') || !value) {
                          return Promise.resolve()
                        }
                        if (dayjs(value).isAfter(dayjs(getFieldValue('endTime')))) {
                          return Promise.reject('Start time cannot be after end time!')
                        }
                        return Promise.resolve()
                      }
                    })
                  ]}
                >
                  <TimePicker
                    format={'HH:mm:ss'}
                    placeholder='Start Time'
                    style={{ width: '100%' }}
                    disabledTime={(current) => {
                      if (form.getFieldValue('reminderDate')?.isSame(dayjs(), 'day')) {
                        return {
                          disabledHours: () => range(0, dayjs().hour()),
                          disabledMinutes: (selectedHour) => {
                            if (selectedHour === dayjs().hour()) {
                              return range(0, dayjs().minute())
                            }
                            return []
                          }
                        }
                      }
                      return {}
                    }}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label='End Time'
                  name='endTime'
                  dependencies={['startTime']}
                  rules={[
                    { required: true, message: 'Please select end time!' },
                    { validator: validateTime('End time') },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue('startTime')) {
                          return Promise.resolve()
                        }
                        if (value.isBefore(getFieldValue('startTime'))) {
                          return Promise.reject('End time cannot be before start time!')
                        }
                        return Promise.resolve()
                      }
                    })
                  ]}
                >
                  <TimePicker
                    placeholder='End Time'
                    style={{ width: '100%' }}
                    disabledTime={(current) => {
                      const startTime = form.getFieldValue('startTime')
                      if (!startTime) return {}

                      if (form.getFieldValue('reminderDate')?.isSame(dayjs(), 'day')) {
                        return {
                          disabledHours: () => range(0, startTime.hour()),
                          disabledMinutes: (selectedHour) => {
                            if (selectedHour === startTime.hour()) {
                              return range(0, startTime.minute())
                            }
                            return []
                          }
                        }
                      }
                      return {}
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div>
              <Form.Item name='status' label='Status' rules={[{ required: true, message: 'Please select status!' }]}>
                <Select>
                  <Select.Option value='Active'>🔵 Active</Select.Option>
                  <Select.Option value='Done'>🟢 Done</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div>
              <Form.Item 
                label='Description' 
                name='description'
                rules={[
                  { required: true, message: 'Please enter description!' },
                  { min: 10, message: 'Description must be at least 10 characters' },
                  { max: 500, message: 'Description cannot exceed 500 characters!' }
                ]}
              >
                <textarea
                  placeholder='Reminder description'
                  className='w-full p-2 border rounded-md bg-background dark:bg-dark-background'
                />
              </Form.Item>
            </div>
            {!isCreateButtonMode && (
              <Form.Item name='reminderDate' hidden>
                <input value={dayjs(selectedDate).format('YYYY-MM-DD')} readOnly />
              </Form.Item>
            )}
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
                className='bg-black text-[#ff6b81] px-4 py-2 rounded-md bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground'
              >
                {currentEvent ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    )
  }

  const handleShowMoreEvents = (date) => {
    setMoreEventsDate(date)
    setShowMoreEventsModal(true)
  }

  const MoreEventsModal = () => {
    const displayEvents = moreEventsDate
      ? events.filter((event) => isSameDay(dayjs(event.reminderDate).format('YYYY-MM-DD'), moreEventsDate)) || []
      : selectedTypeEvents || []

    const modalTitle = moreEventsDate
      ? `Events on ${format(moreEventsDate, 'MMMM d, yyyy')}`
      : `${selectedTypeName || 'Selected'} Reminders`

    return (
      <Modal
        visible={showMoreEventsModal}
        onCancel={() => setShowMoreEventsModal(false)}
        footer={null}
        title={<span className='text-[#ff6b81] text-lg'>{modalTitle}</span>}
        className='custom-modal'
      >
        <div className='space-y-4'>
          {displayEvents.length > 0 ? (
            displayEvents.map((event, i) => {
              const eventType = typeList.find((t) => t.id === event.reminderTypeId)
              const colorClass = eventType ? getEventColor(eventType.typeName) : getEventColor('default')

              return (
                <div
                  key={`${event.id}-${i}`}
                  className={`border border-solid rounded-xl p-2 shadow-md cursor-pointer ${colorClass}`}
                  onClick={() => handleEditEvent(event)}
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='text-lg font-semibold'>{event.title}</h3>
                      <p className='text-sm text-muted-foreground'>{event.description}</p>
                    </div>
                    {event.status === 'Done' && <span className='text-green-500 font-bold'>🟢</span>}
                  </div>
                  <div className='text-sm text-muted-foreground mt-2'>
                    <ClockCircleOutlined /> {format(dayjs(event.reminderDate).toDate(), 'MMMM d, yyyy')}{' '}
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              )
            })
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </Modal>
    )
  }
  return (
    <div className='py-32' style={{ background: 'linear-gradient(to bottom,#f0f8ff, #f6e3e1 )' }}>
      <div className='flex justify-around'>
        <div className='h-full'>
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
                  ${isTodayDate ? 'bg-blue-500 text-white' : ''}
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
          <div className='max-h-[180px] overflow-y-auto scrollbar-custom border border-solid rounded-2xl shadow-md p-5 w-full mt-4 transition'>
            <h1 className='text-[#ff6b81] font-semibold text-lg'>Upcoming Reminders</h1>

            {(() => {
              const upcomingEvents = dataSource.filter((event) =>
                dayjs(event.reminderDate).isSameOrAfter(dayjs(), 'day')
              )

              return upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => {
                  const formattedDate = new Date(event.reminderDate).toLocaleDateString('en-CA')
                  return (
                    <div
                      className={`border border-solid rounded-2xl shadow-md p-5 w-full mb-4 mt-4 ${
                        event.status === 'Done' ? 'border-green-300' : 'border-red-200'
                      } bg-white`}
                      key={event.id}
                    >
                      <div className='flex justify-between'>
                        <strong>{event.title}</strong>
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item key='view' onClick={() => handleEditEvent(event)}>
                                View Details
                              </Menu.Item>
                              <Menu.Item key='delete' danger onClick={() => handleDeleteEvent(event.id)}>
                                Delete
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={['click']}
                          placement='bottomRight'
                        >
                          <Button type='text' icon={<EllipsisOutlined />} className='ml-2' />
                        </Dropdown>
                      </div>
                      <div style={{ fontSize: '14px', color: 'gray' }}>
                        <ClockCircleOutlined /> {formattedDate} {event.startTime}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p>No upcoming reminders.</p>
              )
            })()}
          </div>
          <div className=' max-h-[250px] transition mt-5 p-4 rounded-lg shadow-md overflow-y-auto scrollbar-custom'>
            <h1 className='text-[#ff6b81] text-lg font-semibold mb-3'>Reminder Types</h1>
            <div className='space-y-2'>
              {typeList.map((type) => {
                const isSelected = selectedTypeEvents.includes(type.id)
                const colorClass = getEventColor(type.typeName)
                return (
                  <div
                    key={type.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all
                      ${colorClass} border ${isSelected ? 'ring-2 ring-[#ff6b81]' : 'hover:shadow-md'}`}
                    onClick={() => handleTypeClick(type)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleTypeToggle(type.id)
                      }}
                      className='mr-3'
                    />
                    <span className='font-medium'>{type.typeName}</span>
                    <span className='ml-auto text-sm text-gray-500'>
                      ({events.filter((e) => e.reminderTypeId === type.id).length})
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='w-2/3 h-full p-2 bg-gray-50'>
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
            <div className='mr-4'>
              <button
                className='text-[#ff6b81] flex border border-[#ff6b81] rounded-lg p-2 hover:bg-[#e9bcc2]'
                onClick={() => {
                  setIsCreateButtonMode(true)
                  setCurrentEvent(null)
                  form.resetFields()
                  setShowEventModal(true)
                }}
              >
                <PlusCircleFilled className='mr-2' />
                <h2 className='text-[#ff6b81]'>Create</h2>
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between mb-4'>
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
              const maxEventsToShow = 2
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`p-2 h-32 border rounded-md transition-all ${isToday(date) ? 'bg-accent dark:bg-dark-accent text-accent-foreground dark:text-dark-accent-foreground' : ''} ${!isSameMonth(date, currentDate) ? 'opacity-50' : ''} ${isSameDay(date, selectedDate) ? 'ring-2 ring-primary dark:ring-dark-primary' : ''} hover:bg-muted dark:hover:bg-dark-muted`}
                >
                  <div className='flex flex-col h-full'>
                    <span className='text-sm'>{format(date, 'd')}</span>
                    {dayEvents.length > 0 && (
                      <div className='mt-1 space-y-1 overflow-hidden'>
                        {dayEvents.slice(0, maxEventsToShow).map((event, i) => {
                          const eventType = typeList.find((t) => t.id === event.reminderTypeId)
                          const colorClass = eventType ? getEventColor(eventType.typeName) : getEventColor('default')

                          return (
                            <div key={i} className={`border text-xs p-1 rounded truncate ${colorClass}`}>
                              {event.title}
                              {event.status === 'Done' && <span className='text-green-500 font-bold'> 🟢</span>}
                            </div>
                          )
                        })}
                        {dayEvents.length > maxEventsToShow && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShowMoreEvents(date)
                            }}
                            className='text-xs text-blue-500 hover:text-[#ff6b81]'
                          >
                            Show More
                          </button>
                        )}
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
      {showMoreEventsModal && <MoreEventsModal />}
    </div>
  )
}

export default SchedulePage
