import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectNotifications } from '../../store/modules/global/selector'
import { Bell, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'

const NotificationPage = () => {
  const notificationResponse = useSelector(selectNotifications)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [notificationTimer, setNotificationTimer] = useState<NodeJS.Timeout | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const token = localStorage.getItem('accessToken')
  let user = null
  try {
    user = token ? jwtDecode(token) : null
  } catch (error) {
    console.error('Invalid token:', error)
  }
  useEffect(() => {
    if (user?.id) {
      dispatch({ type: 'GET_ALL_NOTIFICATION_BY_USERID', payload: { userId: user.id } })
    }
  }, [dispatch, user?.id])

  useEffect(() => {
    if (notificationResponse?.length > 0) {
      setNotifications(notificationResponse)
    }
  }, [notificationResponse])

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen text-xl font-semibold text-gray-600'>
        Loading notifications...
      </div>
    )
  }

  const markAsRead = (id) => {
    dispatch({ type: 'UPDATE_NOTIFICATION_STATUS', payload: { id } })
    dispatch({ type: 'GET_ALL_NOTIFICATION_BY_USERID', payload: { userId: user.id } })
  }

  const deleteNotification = (id) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: { id } })
    dispatch({ type: 'GET_ALL_NOTIFICATION_BY_USERID', payload: { userId: user.id } })
  }

  const markAllAsRead = () => {
    const allNotificationIds = notifications.map(notification => notification.id)
    dispatch({ type: 'UPDATE_ALL_IS_READ', payload: { ids: allNotificationIds } })
  }

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id)
    // navigate(ROUTES.SCHEDULE)
  }
  const handleNotificationMouseEnter = () => {
    if (notificationTimer) {
      clearTimeout(notificationTimer)
      setNotificationTimer(null)
    }
  }

  const handleNotificationMouseLeave = () => {
    const newTimer = setTimeout(() => setIsOpen(false), 1000)
    setNotificationTimer(newTimer)
  }
  return (
    <div className='py-32' style={{ background: 'linear-gradient(to bottom,#f0f8ff, #f6e3e1 )' }}>
    <div
      className='mt-14 mb-24 mx-auto max-w-2xl p-6 bg-white rounded-xl border border-solid'
      style={{ boxShadow: '10px 20px 50px 20px rgba(128, 0, 128, 0.5' }}
    >
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
          <Bell className='w-6 h-6 text-blue-500' /> Notifications
        </h1>
        <button onClick={markAllAsRead} className='text-sm text-blue-500 hover:text-black'>
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className='text-gray-500 text-center py-4'>No notifications</p>
      ) : (
        <ul className='space-y-4 cursor-pointer'>
          {notifications.map((notification) => (
            <motion.li
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-between items-center 
                        ${notification.isRead ? 'bg-gray-50 hover: border border-red-200' : 'bg-blue-300'}`}
            >
              <div onClick={() => handleNotificationClick(notification)} className='flex-grow'>
                <h3 className='text-gray-800 font-semibold'>{notification.title}</h3>
                <p className='text-gray-500'>{notification.message}</p>
              </div>

              <div className='relative'>
                <button
                  
                  onClick={() => setDropdownOpen(dropdownOpen === notification.id ? null : notification.id)}
                  className='p-1 rounded-full hover:bg-gray-300'
                >
                  <MoreVertical />
                </button>
                {dropdownOpen === notification.id && (
                  <div
                    className='absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-1 border border-solid z-10'
                    onMouseEnter={handleNotificationMouseEnter}
                    onMouseLeave={handleNotificationMouseLeave}
                  >
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className='w-full text-left px-4 py-2 text-sm hover:bg-gray-200'
                    >
                      Mark as read
                    </button>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-200'
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
    </div>
    
  )
}

export default NotificationPage
