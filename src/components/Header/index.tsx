import { logout } from '@/services/userService'
import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import { UserOutlined } from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Avatar } from 'antd'
import NotificationButton from '@/pages/Notification/NotificationButton'
import { FaCalendarAlt, FaCog, FaPenNib, FaSignOutAlt, FaTachometerAlt, FaUser } from 'react-icons/fa'

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
  .avatar-wrapper {
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
  .dropdown {
    position: absolute;
    top: 65px;
    right: 24px;
    background-color: white;
    border-radius: 0.75rem;
    padding: 0.5rem;
    min-width: 200px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(255, 107, 129, 0.1);
    z-index: 45;

    a,
    .dropdown_item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #4a4a4a;
      text-decoration: none;
      font-size: 0.875rem;
      border-radius: 0.5rem;
      transition: all 0.2s;

      svg {
        margin-right: 0.75rem;
        font-size: 1rem;
        color: #ff6b81;
      }

      &:hover {
        background-color: #fff1f3;
        color: #ff6b81;
      }
    }

    .dropdown_item.logout {
      border-top: 1px solid #f0f0f0;
      margin-top: 0.5rem;
      color: #ff6b81;
      cursor: pointer;

      &:hover {
        background-color: #fff1f3;
      }
    }
  }
`

export default function Header() {
  const token = localStorage.getItem('accessToken')
  const user = token ? jwtDecode(token) : null
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  const handleMouseLeave = () => {
    const newTimer = setTimeout(() => setIsDropDownOpen(false), 1000)
    setTimer(newTimer)
  }

  const handleMouseEnter = () => {
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
      <div className='col-span-2 flex gap-2 items-center cursor-pointer' onClick={() => navigate(ROUTES.GUEST_HOME)}>
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
        <NavLink to={ROUTES.FAQ} className='header_item'>
          FAQ
        </NavLink>
      </div>
      <div className='col-span-2 ms-10 flex justify-center gap-4 text-xs items-center'>
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
            <div className='avatar-wrapper' onClick={toggleDropDown} onMouseEnter={handleMouseEnter}>
              {userImage ? (
                <Avatar
                  size={45}
                  src={
                    userImage ||
                    'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
                  }
                  style={{
                    border: '2px solid #ff6b81',
                    cursor: 'pointer'
                  }}
                />
              ) : (
                <UserOutlined className='text-xl cursor-pointer' />
              )}
            </div>
            {isDropDownOpen && (
              <div className='dropdown' onMouseLeave={handleMouseLeave}>
                <Link to={ROUTES.PROFILE}>
                  <FaUser /> My Profile
                </Link>
                <Link to={ROUTES.MEMBER.DASHBOARD}>
                  <FaTachometerAlt /> Member Dashboard
                </Link>
                <Link to={ROUTES.YOUR_BLOG}>
                  <FaPenNib /> Your Blog
                </Link>
                <Link to={ROUTES.PROFILE}>
                  <FaCog /> Settings
                </Link>
                <Link to={ROUTES.SCHEDULE}>
                  <FaCalendarAlt /> My Schedule
                </Link>
                <div className='dropdown_item logout' onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Wrapper>
  )
}
