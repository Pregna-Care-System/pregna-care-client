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
import NotificationButton from '@/pages/Notification/NotificationButton'

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
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [features, setFeatures] = useState([])

  useEffect(() => {
    if (user) {
      fetchFeatures(user.sub) 
    }
  }, [user])

  const fetchFeatures = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7081/api/v1/Feature?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch features')
      const data = await response.json()
      setFeatures(data)
    } catch (error) {
      console.error('Error fetching features:', error)
    }
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
            <NotificationButton />
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
                <div className='border-t border-gray-300 my-2'></div>
                {features.length > 0 ? (
                  features.map((feature) => (
                    <Link key={feature.id} to={feature.route}>
                      {feature.name}
                    </Link>
                  ))
                ) : (
                  <p className='text-gray-500 text-center text-sm'>No features available</p>
                )}
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
