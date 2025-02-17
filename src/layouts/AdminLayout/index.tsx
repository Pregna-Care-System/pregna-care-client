import AdminSidebar from '@/components/Sidebar/AdminSidebar'
import { logout } from '@/services/userService'
import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import { BellOutlined, CalendarOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { Link } from 'react-router-dom'
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
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-64 bg-gray-800 text-white p-6'>
        <AdminSidebar />
      </div>
      <div className='flex-1 p-8'>
        <div className='flex justify-end items-center mb-10'>
          <div>
            <BellOutlined className='cursor-pointer text-xl' />
          </div>
          Hello,{user.name}
          <HeaderItemProfile onClick={toggleDropDown} onMouseEnter={hadleMouseEnter} className='header_item_profile'>
            {userImage ? (
              <img src={userImage} alt='User Avatar' />
            ) : (
              <UserOutlined className='text-xl cursor-pointer' />
            )}
          </HeaderItemProfile>
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
