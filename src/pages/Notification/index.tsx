import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { selectNotifications } from '../../store/modules/global/selector'
import { Bell, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'
import Loading from '@/components/Loading'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@store/modules/global/selector'

const NotificationPage = () => {
  const notificationResponse = useSelector(selectNotifications)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [timer, setNotificationTimer] = useState<NodeJS.Timeout | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(5)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUserInfo)

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
    return <Loading />
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
    const allNotificationIds = notifications.map((notification) => notification.id)
    dispatch({ type: 'UPDATE_ALL_IS_READ', payload: { ids: allNotificationIds } })
    dispatch({ type: 'GET_ALL_NOTIFICATION_BY_USERID', payload: { userId: user.id } })
  }

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id)
    navigate(ROUTES.SCHEDULE)
  }
  const handleMouseLeave = () => {
    const newTimer = setTimeout(() => setDropdownOpen(false), 1000)
    setNotificationTimer(newTimer)
  }

  const handleMouseEnter = () => {
    if (timer) {
      clearTimeout(timer)
      setNotificationTimer(null)
    }
  }
  const toggleDropDown = (id: string) => {
    setDropdownOpen((prev) => (prev === id ? null : id))
  }

  const loadMoreNotifications = () => {
    setVisibleCount((prevCount) => prevCount + 5)
  }

  return (
    <div className='py-32' style={{ background: 'linear-gradient(to bottom,#f0f8ff, #f6e3e1 )' }}>
      <div className='mt-2 mb-20 mx-auto max-w-2xl p-6 bg-white rounded-xl border border-solid shadow-2xl'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-3xl font-bold text-[#ff6b81] flex items-center gap-2'>
            <Bell className='w-6 h-6 text-[#ff6b81]' /> Notifications
          </h1>
          <button onClick={markAllAsRead} className='text-sm text-blue-500 hover:text-black'>
            Mark all as read
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className='text-gray-500 text-center py-4'>No notifications</p>
        ) : (
          <>
            <ul className='space-y-4 cursor-pointer'>
              {notifications.slice(0, visibleCount).map((notification) => (
                <motion.li
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg shadow-md hover:shadow-xl hover:bg-[#fff1f3] transition-all flex justify-between items-center 
                        ${notification.isRead ? 'bg-gray-100 hover: border border-[#ff6b81]' : 'bg-blue-300'}`}
                >
                  <div onClick={() => handleNotificationClick(notification)} className='flex-grow'>
                    <div className='flex items-center'>
                      <div>
                        <p className='text-gray-800 flex items-center'>
                          {notification.title}
                          {!notification.isRead && <div className='w-3 h-3 bg-blue-500 rounded-full ml-2'></div>}
                        </p>
                        <p className='text-gray-500'>{notification.message}</p>
                      </div>
                    </div>
                  </div>

                  <div className='relative'>
                    <button
                      onClick={() => toggleDropDown(notification.id)}
                      className='p-1 rounded-full hover:bg-gray-300'
                      onMouseEnter={handleMouseEnter}
                    >
                      <MoreVertical />
                    </button>

                    {dropdownOpen === notification.id && (
                      <div
                        className='absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-1 border border-solid z-10'
                        onMouseLeave={handleMouseLeave}
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
            {visibleCount < notifications.length && (
              <div className='flex justify-center mt-10'>
                <button
                  onClick={loadMoreNotifications} 
                  className='text-lg p-2 border border-[#ff6b81] rounded-lg bg-[#ff6b81] text-white hover:bg-black hover:text-white'
                >
                  More notifications
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationPage
