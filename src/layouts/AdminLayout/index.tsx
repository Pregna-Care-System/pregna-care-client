import AdminSidebar from '@/components/Sidebar/AdminSidebar'
import { logout } from '@/services/userService'
import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import { BellOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import styled from 'styled-components'

const HeaderItemProfile = styled.div`
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
`
const Dropdown = styled.div`
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
`

export default function AdminLayout({ children }) {
  const token = localStorage.getItem('accessToken')
  const user = token ? jwtDecode(token) : null
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

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

  const userImage = user?.image || null
  return (
    <div className='flex min-h-screen'  style={{ background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)' }}>
      <div className='w-64 bg-gray-800 text-white p-6'>
        <AdminSidebar />
      </div>
      <div className='flex-1 px-6 py-4'>
        <div className='flex justify-end items-center mb-10 space-x-4'>
          <BellOutlined className='cursor-pointer text-2xl text-gray-600 hover:text-gray-800 transition duration-300' />

          <div className='flex items-center space-x-3'>
            <span className='text-lg font-medium text-gray-700'>Hello, {user.name}</span>
            <HeaderItemProfile onClick={toggleDropDown} onMouseEnter={hadleMouseEnter} className='relative'>
              {userImage ? (
                <img
                  src={userImage}
                  alt='User Avatar'
                  className='w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-500 transition duration-300'
                />
              ) : (
                <UserOutlined className='text-2xl text-gray-600 cursor-pointer' />
              )}
            </HeaderItemProfile>
          </div>

          {isDropDownOpen && (
            <Dropdown className='dropdown' onMouseLeave={handleMouseLeave}>
              <Link to={ROUTES.PROFILE}>
                <UserOutlined /> My Profile
              </Link>
              <Link to={ROUTES.PROFILE}>
                <SettingOutlined /> Setting
              </Link>
              <div className='dropdown_item cursor-pointer border-t border-t-gray-300' onClick={handleLogout}>
                <LogoutOutlined /> Logout
              </div>
            </Dropdown>
          )}
        </div>

        {children}
      </div>
    </div>
  )
}
