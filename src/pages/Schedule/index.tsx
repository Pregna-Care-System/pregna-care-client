import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid, createViewDay, createViewMonthAgenda } from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { Button, DatePicker, Form, Input, Modal, Select, TimePicker } from 'antd'
import { ArrowRightOutlined, ClockCircleOutlined, DeleteOutlined, FolderAddFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { selectReminderInfo, selectReminderTypeInfo } from '@/store/modules/global/selector'

const Wrapper = styled.div`
  .sx-react-calendar-wrapper {
    width: 900px;
    height: 700px;
  }
`

export default function SchedulePage() {
  const dataSource = useSelector(selectReminderInfo)
  const typeResponse = useSelector(selectReminderTypeInfo)
  const [typeList, setTypeList] = useState([])
  const dispatch = useDispatch()
  const [isModalOpen, setModalOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    dispatch({ type: 'GET_ALL_REMINDER_INFORMATION' })
    dispatch({ type: 'GET_ALL_REMINDER_TYPE_INFORMATION' })
  }, [dispatch])

  useEffect(() => {
    if (typeResponse !== null) {
      setTypeList(typeResponse)
    }
  }, [typeResponse])

  const showModal = () => setModalOpen(true)

  const handleCancel = () => {
    setModalOpen(false)
    setCurrentEvent(null)
    form.resetFields()
  }

  const handleEditEvent = (event) => {
    setCurrentEvent(event)
    form.setFieldsValue({
      title: event.title,
      reminderType: event.reminderTypeId,
      reminderDate: dayjs(event.reminderDate),
      startTime: dayjs(event.startTime, 'HH:mm:ss'),
      endTime: dayjs(event.endTime, 'HH:mm:ss'),
      description: event.description
    })
    setModalOpen(true)
  }

  const handleAddEvent = () => {
    form.validateFields().then((values) => {
      const { reminderType, title, reminderDate, startTime, endTime, description } = values
      const newEventItem = {
        reminderTypeId: reminderType,
        title,
        description,
        reminderDate: dayjs(reminderDate).format('YYYY-MM-DD'),
        startTime: dayjs(startTime).format('HH:mm:ss'),
        endTime: dayjs(endTime).format('HH:mm:ss'),
        status: 'ACTIVE'
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
            status: 'ACTIVE',
            id: currentEvent.id
          }
        })
      } else {
        dispatch({ type: 'CREATE_REMINDER', payload: newEventItem })
      }

      setModalOpen(false)
      form.resetFields()
    })
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
    });
  }

  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewDay(), createViewMonthAgenda(), createViewMonthGrid()],
    events: dataSource.map((event) => ({
      id: event.id,
      title: event.title,
      start: dayjs(event.reminderDate)
        .set('hour', dayjs(event.startTime).hour())
        .set('minute', dayjs(event.startTime).minute())
        .format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs(event.reminderDate)
        .set('hour', dayjs(event.endTime).hour())
        .set('minute', dayjs(event.endTime).minute())
        .format('YYYY-MM-DD HH:mm:ss'),
      description: event.description
    })),
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()]
  })

  return (
    <Wrapper
      className='px-2 py-40 flex justify-around'
      style={{ background: 'linear-gradient(to bottom,#f0f8ff, #f6e3e1 )' }}
    >
      <div className='flex flex-col'>
        <div className='create_button'>
          <Button className='p-8 border border-solid bg-blue-300 rounded-2xl' onClick={showModal}>
            <FolderAddFilled /> Create New
          </Button>
        </div>

        <Modal
          title={currentEvent ? 'Edit Reminder' : 'Create New Reminder'}
          visible={isModalOpen}
          onCancel={handleCancel}
          onOk={handleAddEvent}
        >
          <Form form={form} layout='vertical'>
            <Form.Item
              name='title'
              label='Reminder Title'
              rules={[{ required: true, message: 'Please enter reminder title!' }]}
            >
              <Input placeholder='Event Title' />
            </Form.Item>

            <Form.Item
              name='reminderType'
              label='Reminder type'
              rules={[{ required: true, message: 'Please select one reminder type!' }]}
            >
              <Select
                placeholder='Select reminder type'
                options={typeList.map((type) => ({ label: type.typeName, value: type.id }))}
              />
            </Form.Item>

            <Form.Item
              name='reminderDate'
              label='Reminder Date'
              rules={[{ required: true, message: 'Please select a date!' }]}
            >
              <DatePicker placeholder='Date Start' style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label='Time Range' style={{ marginBottom: 0 }}>
              <div className='flex items-center'>
                <Form.Item
                  name='startTime'
                  rules={[{ required: true, message: 'Please select start time!' }]}
                  style={{ width: '48%' }}
                >
                  <TimePicker format={'HH:mm:ss'} placeholder='Start Time' style={{ width: '100%' }} />
                </Form.Item>
                <ArrowRightOutlined style={{ margin: '10px' }} />
                <Form.Item
                  name='endTime'
                  rules={[{ required: true, message: 'Please select end time!' }]}
                  style={{ width: '48%' }}
                >
                  <TimePicker placeholder='End Time' style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item name='description' label='Reminder Description'>
              <Input.TextArea placeholder='Reminder Description' />
            </Form.Item>
          </Form>
        </Modal>

        <div className='mt-10'>
          <h1 style={{ fontWeight: 'bold', fontSize: '25px' }}>Upcoming Events</h1>
          {dataSource.length > 0 ? (
            dataSource.map((event) => {
              const formattedDate = new Date(event.reminderDate).toLocaleDateString('en-CA')
              return (
                <div className='border border-solid bg-white rounded-2xl shadow-md p-5 mb-4 mt-4' key={event.id}>
                  <strong>{event.title}</strong>
                  <div style={{ fontSize: '14px', color: 'gray' }}>
                    <ClockCircleOutlined /> {formattedDate} {event.startTime}
                  </div>
                  <Button style={{ marginRight: '10px' }} onClick={() => handleEditEvent(event)}>
                    View Details
                  </Button>
                  <Button className='bg-slate-300 text-red-500' type='danger' icon={<DeleteOutlined />} onClick={() => handleDeleteEvent(event.id)}>
                  </Button>
                </div>
              )
            })
          ) : (
            <p>No upcoming events.</p>
          )}
        </div>
      </div>

      <ScheduleXCalendar calendarApp={calendar} />
    </Wrapper>
  )
}
