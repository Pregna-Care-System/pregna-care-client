import { selectNotifications } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'
import { BellFilled, BellOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function NotificationButton() {
  const [notificationTimer, setNotificationTimer] = useState<NodeJS.Timeout | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const notificationInfo = useSelector(selectNotifications)
  const [notifications, setNotifications] = useState(notificationInfo)

  const unreadCount = notificationInfo.filter((n) => !n.isRead).length

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification))
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const handleNotificationClick = (notification) => {
    setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
    setShowAllNotifications(true)
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
    <div className='relative ml-16'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='p-2 relative hover:bg-red-300 bg-slate-200 rounded-full transition-colors duration-200 border border-solid border-purple-100'
        aria-label='Notifications'
      >
        {unreadCount > 0 ? (
          <BellFilled className='text-xl text-primary' />
        ) : (
          <BellOutlined className='text-xl text-primary' />
        )}
        {unreadCount > 0 && (
          <span className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs'>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className='absolute right-0 left-auto mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-100 border border-solid'
          onMouseEnter={handleNotificationMouseEnter}
          onMouseLeave={handleNotificationMouseLeave}
        >
          <>
            <div className='flex justify-between items-center px-4 py-2 border-b border-border'>
              <h1 className='font-heading text-foreground'>Notifications</h1>
              <div className='flex gap-2'>
                <button
                  onClick={markAllAsRead}
                  className='text-xs text-primary hover:text-accent transition-colors duration-200'
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => navigate(ROUTES.NOTIFICATION)}
                  className='text-xs text-primary hover:text-accent transition-colors duration-200'
                >
                  <button>See all</button>
                </button>
              </div>
            </div>
            <div className='max-h-[400px] overflow-y-auto'>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} onClick={() => handleNotificationClick(notification)}>
                    <p className={notification.isRead ? 'text-gray-500' : 'text-black font-bold'}>
                      {notification.title}
                    </p>
                    <p>{notification.message}</p>
                  </div>
                ))
              ) : (
                <p>No notifications</p>
              )}
            </div>
          </>
        </div>
      )}
    </div>
  )
}
