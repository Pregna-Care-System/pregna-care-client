import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectNotifications } from '../../store/modules/global/selector'
import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'

const NotificationPage: React.FC = () => {
  const notifications = useSelector(selectNotifications)
  const [loading, setLoading] = useState(true)

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

  return (
    <div
      className='mt-36 mb-24 mx-auto max-w-2xl p-6 bg-white rounded-xl border border-solid shadow-2xl'
      style={{ boxShadow: '0 4px 6px rgba(128, 0, 128, 0.1), 0 10px 15px rgba(128, 0, 128, 0.2)' }}
    >
      <h1 className='text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
        <Bell className='w-6 h-6 text-blue-500' /> Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className='text-gray-500 text-center py-4'>No notifications</p>
      ) : (
        <ul className='space-y-4 cursor-pointer'>
          {notifications.map((notification: any) => (
            <motion.li
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all'
            >
              <h3 className='text-lg font-semibold text-gray-800'>{notification.title}</h3>
              <p className='text-gray-400'>{notification.message}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NotificationPage
