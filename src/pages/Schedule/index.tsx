import styled from 'styled-components'
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid, createViewDay, createViewMonthAgenda } from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { Button, DatePicker, Input, Modal, TimePicker } from 'antd'
import { ArrowRightOutlined, ClockCircleOutlined, FolderAddFilled } from '@ant-design/icons'
import { useState } from 'react'
import dayjs from 'dayjs'

const Wrapper = styled.div`
  .sx-react-calendar-wrapper {
    width: 900px;
    height: 700px;
  }
`

export default function SchedulePage() {
  const currentDate = dayjs()
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Met du luon a',
      start: '2025-01-26 00:00',
      end: '2025-01-26 02:00',
      description: 'My cool description'
    },
    {
      id: 2,
      title: 'Met qua a',
      start: '2025-01-25 22:00',
      end: '2025-01-25 23:00',
      description: 'My hehe description'
    }
  ])
  const [isModalOpen, setModalOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<MODEL.Event>({
    title: '',
    date: null,
    timeStart: null,
    timeEnd: null,
    description: ''
  })

  const showModal = () => {
    setModalOpen(true)
  }
  const handleCancel = () => {
    setModalOpen(false)
  }
  const handleAddEvent = () => {
    const { title, date, timeStart, timeEnd, description } = newEvent
    if (title && date && timeStart && timeEnd && description) {
      const newEventItem = {
        id: events.length + 1,
        title,
        start: `${dayjs(date).format('YYYY-MM-DD')} ${dayjs(timeStart).format('HH:mm')}`,
        end: `${dayjs(date).format('YYYY-MM-DD')} ${dayjs(timeEnd).format('HH:mm')}`,
        description
      }
      setEvents((prevEvent) => [...prevEvent, newEventItem])
      setNewEvent({
        title: '',
        date: null,
        timeStart: null,
        timeEnd: null,
        description: ''
      })
      setModalOpen(false)
    }
  }
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewDay(), createViewMonthAgenda(), createViewMonthGrid()],
    events: events,
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()]
  })
  console.log('Events:', events)

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
        <Modal title='Create New Event' visible={isModalOpen} onCancel={handleCancel} onOk={handleAddEvent}>
          <div className='mb-5 mt-5'>
            <label className='text-gray-700'>Event Title</label>
            <Input
              className='mt-1'
              placeholder='Event Title'
              value={newEvent.title}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setNewEvent((prev: any) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className='mb-5'>
            <label className='text-gray-700 block'>Event Date</label>
            <DatePicker
              className='mt-1 mr-2'
              placeholder='Date Start'
              value={newEvent.date}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(date) => setNewEvent((prev: any) => ({ ...prev, date }))}
            />
            <TimePicker
              format='HH:mm'
              placeholder='Start Time'
              value={newEvent.timeStart}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(time) => setNewEvent((prev: any) => ({ ...prev, timeStart: time }))}
            />
            <ArrowRightOutlined />
            <TimePicker
              format='HH:mm'
              placeholder='End Time'
              value={newEvent.timeEnd}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(time) => setNewEvent((prev: any) => ({ ...prev, timeEnd: time }))}
            />
          </div>
          <div className='mb-5'>
            <label className='text-gray-700'>Event Description</label>
            <Input.TextArea
              className='mt-1 mb-5'
              placeholder='Event Description'
              value={newEvent.description}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setNewEvent((prev: any) => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </Modal>

        <div className='mt-10'>
          <h1 style={{ fontWeight: 'bold', fontSize: '25px' }}>Upcoming Events</h1>
          {events
            .filter((event) => dayjs(event.end).isAfter(currentDate))
            .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
            .map((event) => (
              <div className='border border-solid bg-white rounded-2xl shadow-md p-5 mb-4 mt-4' key={event.id}>
                <strong>{event.title}</strong>
                <div style={{ fontSize: '14px', color: 'gray' }}>
                  <ClockCircleOutlined /> {event.start}
                </div>
              </div>
            ))}
        </div>
      </div>
      <ScheduleXCalendar calendarApp={calendar} />
    </Wrapper>
  )
}