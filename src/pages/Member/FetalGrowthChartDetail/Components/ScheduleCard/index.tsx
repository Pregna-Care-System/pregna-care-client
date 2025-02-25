'use client'

import { useState } from 'react'
import { Badge, Calendar, Modal, Tag, Card, Divider } from 'antd'
import type { Dayjs } from 'dayjs'
import { format, addDays, isAfter, isSameDay } from 'date-fns'
import { CalendarIcon, Clock, User, Building2, ChevronRight } from 'lucide-react'

// Sample appointment data - replace with your actual data
const appointments = [
  {
    id: 1,
    title: 'Khám tổng quát',
    date: new Date(),
    time: '09:00',
    doctor: 'Dr. Nguyen Van A',
    department: 'Khoa Nội',
    status: 'confirmed',
    patientName: 'Nguyen Van X',
    room: 'P.201'
  },
  {
    id: 2,
    title: 'Tái khám',
    date: addDays(new Date(), 2),
    time: '14:30',
    doctor: 'Dr. Tran Thi B',
    department: 'Khoa Tim mạch',
    status: 'pending',
    patientName: 'Tran Thi Y',
    room: 'P.305'
  },
  {
    id: 3,
    title: 'Khám định kỳ',
    date: addDays(new Date(), 5),
    time: '10:15',
    doctor: 'Dr. Le Van C',
    department: 'Khoa Nội tiết',
    status: 'confirmed',
    patientName: 'Le Van Z',
    room: 'P.103'
  }
]

interface Appointment {
  id: number
  title: string
  date: Date
  time: string
  doctor: string
  department: string
  status: 'confirmed' | 'pending' | 'cancelled'
  patientName: string
  room: string
}

export default function MedicalCalendar() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) => format(appointment.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
  }

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    const now = new Date()
    return appointments
      .filter((appointment) => isAfter(appointment.date, now) || isSameDay(appointment.date, now))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3) // Only show next 3 appointments
  }

  // Custom date cell renderer
  const dateCellRender = (value: Dayjs) => {
    const date = value.toDate()
    const dayAppointments = getAppointmentsForDate(date)

    return (
      <ul className='list-none p-0'>
        {dayAppointments.map((appointment) => (
          <li key={appointment.id} onClick={() => handleAppointmentClick(appointment)} className='group'>
            <Badge
              status={appointment.status === 'confirmed' ? 'success' : 'warning'}
              text={
                <span className='text-xs cursor-pointer group-hover:text-primary transition-colors'>
                  {appointment.time} - {appointment.title}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    )
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận'
      case 'pending':
        return 'Chờ xác nhận'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <Card className='shadow-sm border-0 overflow-hidden'>
      {/* Header with gradient */}
      <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/80 to-blue-600/80 -mx-6 -mt-6' />

      {/* Main content */}
      <div className='relative'>
        {/* Calendar header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white rounded-lg shadow-md'>
              <CalendarIcon className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h2 className='text-lg font-semibold '>Lịch khám bệnh</h2>
              <p className='text-sm'>Quản lý lịch khám của bạn</p>
            </div>
          </div>
        </div>

        {/* Calendar and Upcoming Grid */}
        <div className='space-y-6'>
          {/* Calendar Section */}
          <div className='bg-white rounded-xl p-4 shadow-md'>
            <Calendar className='custom-calendar' dateCellRender={dateCellRender} fullscreen={false} />
          </div>

          {/* Upcoming Section */}
          <div className='bg-white/80 backdrop-blur rounded-xl p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-medium text-gray-800 flex items-center gap-2'>
                <Clock className='w-4 h-4 text-primary' />
                Upcomming
              </h3>
            </div>

            <div className='space-y-3'>
              {getUpcomingAppointments().map((appointment, index) => (
                <div
                  key={appointment.id}
                  className='p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className='flex items-start gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
                      <span className='text-primary font-medium'>{format(appointment.date, 'dd')}</span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2'>
                        <h4 className='font-medium text-gray-900 truncate'>{appointment.title}</h4>
                        <Tag color={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Tag>
                      </div>
                      <div className='mt-1 space-y-1'>
                        <p className='text-sm text-gray-500 flex items-center gap-2'>
                          <Clock className='w-3 h-3' />
                          {format(appointment.date, 'dd/MM/yyyy')} {appointment.time}
                        </p>
                        <p className='text-sm text-gray-500 flex items-center gap-2'>
                          <User className='w-3 h-3' />
                          {appointment.doctor}
                        </p>
                        <p className='text-sm text-gray-500 flex items-center gap-2'>
                          <Building2 className='w-3 h-3' />
                          {appointment.department} - {appointment.room}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className='w-4 h-4 text-gray-400' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <Modal
        title={
          <div className='flex items-center gap-2 pb-3 mb-3 border-b'>
            <CalendarIcon className='w-5 h-5 text-primary' />
            <span>Chi tiết lịch khám</span>
          </div>
        }
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        className='appointment-modal'
      >
        {selectedAppointment && (
          <div className='space-y-6'>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-lg font-medium text-gray-900'>{selectedAppointment.title}</h3>
                <p className='text-sm text-gray-500'>Phòng: {selectedAppointment.room}</p>
              </div>
              <Tag color={getStatusColor(selectedAppointment.status)}>{getStatusText(selectedAppointment.status)}</Tag>
            </div>

            <div className='grid gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Clock className='w-4 h-4 text-primary' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Thời gian</p>
                  <p className='font-medium'>
                    {format(selectedAppointment.date, 'dd/MM/yyyy')} {selectedAppointment.time}
                  </p>
                </div>
              </div>

              <Divider className='my-2' />

              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <User className='w-4 h-4 text-primary' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Bệnh nhân</p>
                  <p className='font-medium'>{selectedAppointment.patientName}</p>
                </div>
              </div>

              <Divider className='my-2' />

              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <User className='w-4 h-4 text-primary' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Bác sĩ</p>
                  <p className='font-medium'>{selectedAppointment.doctor}</p>
                </div>
              </div>

              <Divider className='my-2' />

              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Building2 className='w-4 h-4 text-primary' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Khoa</p>
                  <p className='font-medium'>{selectedAppointment.department}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  )
}
