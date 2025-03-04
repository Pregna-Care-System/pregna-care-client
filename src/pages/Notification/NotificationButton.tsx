import { selectNotifications } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'
import { BellFilled, BellOutlined, MoreOutlined } from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function NotificationButton() {
  const [notificationTimer, setNotificationTimer] = useState<NodeJS.Timeout | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const navigate = useNavigate()
  const notificationInfo = useSelector(selectNotifications)
  const [notifications, setNotifications] = useState(notificationInfo)
  const dispatch = useDispatch()
  const [visibleCount, setVisibleCount] = useState(5)
  const token = localStorage.getItem('accessToken')
  let user = null
  try {
    user = token ? jwtDecode(token) : null
  } catch (error) {
    console.error('Invalid token:', error)
  }
  useEffect(() => {
          dispatch({ type: 'GET_ALL_NOTIFICATION_BY_USERID', payload: { userId: user.id } })
      }, [dispatch])

  useEffect(() => {
    if (notificationInfo !== null && notificationInfo.length > 0) {
      setNotifications(notificationInfo)
    }
  }, [notificationInfo])

  const unreadCount = notificationInfo.filter((n) => !n.isRead).length

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
    navigate(ROUTES.NOTIFICATION)
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

  const loadMoreNotifications = () => {
    setVisibleCount((prevCount) => prevCount + 5)
  }
  return (
    <div className='relative ml-16'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 bg-gray-100 rounded-full transition hover:bg-[#fff1f3] border border-[#f4d3d8]'
        aria-label='Notifications'
      >
        {unreadCount > 0 ? (
          <BellFilled className='text-xl text-primary' />
        ) : (
          <BellOutlined className='text-xl text-primary' />
        )}
        {unreadCount > 0 && (
          <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center'>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className='absolute right-0 left-auto mt-2 w-80 bg-white shadow-xl py-2 z-100 border border-solid rounded-xl'
          onMouseEnter={handleNotificationMouseEnter}
          onMouseLeave={handleNotificationMouseLeave}
        >
          <>
            <div className='flex justify-between items-center px-4 py-2 border-b border-border'>
              <h1 className='font-bold text-lg '>Notifications</h1>
              <div className='flex gap-2'>
                <button
                  onClick={markAllAsRead}
                  className='text-xs text-blue-600 hover:text-black transition-colors duration-200'
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => navigate(ROUTES.NOTIFICATION)}
                  className='text-xs text-blue-600 hover:text-black transition-colors duration-200'
                >
                  See all
                </button>
              </div>
            </div>
            <div className='max-h-[400px] overflow-y-auto scrollbar-custom divide-y divide-gray-200'>
              {notifications.length > 0 ? (
                notifications.slice(0, visibleCount).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border border-solid flex items-center justify-between px-4 py-3 hover:shadow-xl hover:bg-[#fff1f3]
                      ${notification.isRead ? 'bg-gray-50' : 'bg-blue-300'}`}
                  >
                    <div onClick={() => handleNotificationClick(notification)} className='cursor-pointer flex-grow'>
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
                        onClick={() => setDropdownOpen(dropdownOpen === notification.id ? null : notification.id)}
                        className='p-1 rounded-full hover:bg-gray-300 transition-all'
                      >
                        <MoreOutlined />
                      </button>
                      {dropdownOpen === notification.id && (
                        <div className='absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-1 border border-solid z-50'>
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
                  </div>
                ))
              ) : (
                <p>No notifications</p>
              )}
              {visibleCount < notifications.length && (
                <div className='flex justify-center'>
                  <button onClick={loadMoreNotifications} className='text-sm mt-2 text-black'>
                    More notifications
                  </button>
                </div>
              )}
            </div>
          </>
        </div>
      )}
    </div>
  )
}
