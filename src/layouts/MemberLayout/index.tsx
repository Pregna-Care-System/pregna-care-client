import ChatBot from '@/components/Chat'
import { logout } from '@/services/userService'
import { selectUserInfo } from '@/store/modules/global/selector'
import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import { CalendarOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import MemberSidebar from '@components/Sidebar/MemberSidebar'
import { Avatar } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
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

export default function MemberLayout({ children }) {
  const user = useSelector(selectUserInfo)
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

  return (
    <div className='flex'>
      <div className='w-64 text-white p-6'>
        <MemberSidebar />
      </div>
      <Wrapper className='flex-1 bg-white'>
        <div className=' flex justify-end items-center px-6 py-4'>
          <h4 className='px-2 border-s-2 border-gray-300'>
            Hello, <strong>{user.name}</strong>
          </h4>
          <div onClick={toggleDropDown} onMouseEnter={hadleMouseEnter}>
            {user.image ? (
              <Avatar size={50} src={user.image} />
            ) : (
              <Avatar
                size={50}
                src={
                  'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
                }
              />
            )}
          </div>
          {isDropDownOpen && (
            <div onMouseLeave={handleMouseLeave} className='dropdown z-10'>
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
        </div>
        <div className='px-8 py-10 bg-gray-100'>{children}</div>
        <ChatBot />
      </Wrapper>
    </div>
  )
}
