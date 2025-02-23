import { logout } from '@/services/userService'
import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import {
  BellFilled,
  BellOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MailFilled,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { MailPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { MdErrorOutline } from 'react-icons/md'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'antd'
import { useSelector } from 'react-redux'
import { selectNotifications } from '@/store/modules/global/selector'

const Wrapper = styled.div`
  .active {
    color: ${style.COLORS.RED.RED_5};
  }
  .header_item:hover {
    color: ${style.COLORS.RED.RED_5};
  }
  .header_item_profile {
    transition:
      transform 0.4s ease,
      opacity 0,
      4s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
      opacity: 0.9;
    }
    img {
      transition: transform 0.4s ease;
      border-radius: 50%;
      object-fit: cover;
      width: 40px;
      height: 40px;
    }
  }
  .dropdown {
    position: absolute;
    top: 65px;
    right: 0;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    min-width: 150px;

    .dropdown_item {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      color: #4a4a4a;
      cursor: pointer;
      &:hover {
        background-color: ${style.COLORS.RED.RED_5};
        color: #fff;
      }
    }

    a {
      display: block;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      color: #4a4a4a;
      text-decoration: none;
      transition:
        background-color 0.3s,
        color 0.3s;

      &:hover {
        background-color: ${style.COLORS.RED.RED_5};
        color: #fff;
      }
    }
  }
`

export default function Header() {
  const token = localStorage.getItem('accessToken')
  const user = token ? jwtDecode(token) : null
  const navigate = useNavigate()
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [notificationTimer, setNotificationTimer] = useState<NodeJS.Timeout | null>(null)
  const [isOpen, setIsOpen] = useState(false)
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

  const handleMouseLeave = () => {
    const newTimer = setTimeout(() => setIsDropDownOpen(false), 1000)
    setTimer(newTimer)
  }

  const hadleMouseEnter = () => {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
  }

  const toggleDropDown = () => {
    setIsDropDownOpen((prev) => !prev)
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

  const handleLogout = () => {
    logout()
  }

  const userImage = user?.picture || null

  return (
    <Wrapper className='grid grid-cols-12 w-full p-4 bg-white fixed z-10'>
      <div className='col-span-2 flex gap-2 items-center'>
        <img
          src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
          alt='logo'
          style={{ width: '60px' }}
        />
        <span className='text-red-500 text-xl font-bold'>PregnaCare</span>
      </div>
      <div className='col-span-8 flex justify-center items-center gap-8 font-bold'>
        <NavLink to={ROUTES.GUEST_HOME} className='header_item'>
          Home
        </NavLink>
        <NavLink to={ROUTES.SERVICES} className='header_item'>
          Services
        </NavLink>
        <NavLink to={ROUTES.BLOG} className='header_item'>
          Blog
        </NavLink>
        <NavLink to={ROUTES.MEMBESHIP_PLANS} className='header_item'>
          Pricing
        </NavLink>
        <NavLink to={ROUTES.NUTRITION_AND_FITNESS} className='header_item'>
          Nutrition and Fitness
        </NavLink>
        <NavLink to={ROUTES.COMMUNITY} className='header_item'>
          Community
        </NavLink>
        <NavLink to={ROUTES.CONTACT} className='header_item'>
          Contact Us
        </NavLink>
      </div>
      <div className='col-span-2 ms-10 flex justify-center gap-4 font-bold text-xs items-center'>
        {user === null ? (
          <>
            <Link to={ROUTES.REGISTER} className='border-red-400 border-2 bg-white text-red-500 rounded py-2 px-4'>
              Sign Up
            </Link>
            <Link to={ROUTES.LOGIN} className='bg-red-500 text-white rounded py-2 px-4 border-red-500 border-2'>
              Sign In
            </Link>
          </>
        ) : (
          <>
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
            <div onClick={toggleDropDown} onMouseEnter={hadleMouseEnter} className='header_item_profile ml-auto'>
              {userImage ? (
                <img src={userImage} alt='User Avatar' />
              ) : (
                <UserOutlined className='text-xl cursor-pointer' />
              )}
            </div>
            {isDropDownOpen && (
              <div className='dropdown' onMouseLeave={handleMouseLeave}>
                <Link to={ROUTES.PROFILE}>
                  <UserOutlined /> My Profile
                </Link>
                <Link to={ROUTES.MEMBER.DASHBOARD}>
                  <UserOutlined /> Member dashboard
                </Link>
                <Link to={ROUTES.PROFILE}>
                  <SettingOutlined /> Setting
                </Link>
                <Link to={ROUTES.SCHEDULE}>
                  <CalendarOutlined /> My Schedule
                </Link>
                <div className='dropdown_item cursor-pointer border-t border-t-gray-300' onClick={handleLogout}>
                  <LogoutOutlined /> Logout
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Wrapper>
  )
}
