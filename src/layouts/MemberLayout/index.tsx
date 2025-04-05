import ChatBot from '@/components/Chat'
import { logout } from '@/services/userService'
import { selectMemberInfo, selectUserInfo } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'
import MemberSidebar from '@components/Sidebar/MemberSidebar'
import { Avatar } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FaCog, FaHistory, FaSignOutAlt, FaTachometerAlt, FaUser } from 'react-icons/fa'
import UserAvatar from '@/components/common/UserAvatar'

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #ff6b81 0%, #ff8296 100%);

  .layout-container {
    display: flex;
    width: 100%;
    min-height: 100vh;
    position: relative;
  }

  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 16rem;
    z-index: 40;
  }

  .main-content {
    flex: 1;
    margin-left: 16rem;
    display: flex;
    flex-direction: column;
    background: #fff;
    min-height: 100vh;
    position: relative;
    z-index: 30;
  }

  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1rem 1.5rem;
    background: white;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    position: relative;
    z-index: 35;

    .welcome-text {
      padding: 0 0.5rem;
      margin-right: 1rem;
      border-left: 2px solid #ff6b81;
      color: #4a4a4a;

      strong {
        color: #ff6b81;
      }
    }

    .avatar-wrapper {
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .content {
    flex: 1;
    padding: 2rem;
    background: #f8f9fa;
    position: relative;
    z-index: 30;
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

      &:hover {
        background-color: #fff1f3;
      }
    }
  }

  @media (max-width: 1024px) {
    .sidebar-container {
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;

      &.sidebar-open {
        transform: translateX(0);
      }
    }

    .main-content {
      margin-left: 0;
      width: 100%;
    }
  }
`

export default function MemberLayout({ children }) {
  const user = useSelector(selectMemberInfo)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <LayoutWrapper>
      <div className='layout-container'>
        <div className={`sidebar-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <MemberSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        </div>
        <div className='main-content'>
          <div className='header'>
            <h4 className='welcome-text'>
              Hello, <strong className='capitalize'>{user.fullName}</strong>
            </h4>
            <div className='avatar-wrapper' onClick={toggleDropDown} onMouseEnter={handleMouseEnter}>
              <UserAvatar src={user.imageUrl} name={user.fullName} size={40} />
            </div>
            {isDropDownOpen && (
              <div className='dropdown' onMouseLeave={handleMouseLeave}>
                <Link to={ROUTES.PROFILE}>
                  <FaUser /> My Profile
                </Link>
                <Link to={ROUTES.MEMBER.DASHBOARD}>
                  <FaTachometerAlt /> Member Dashboard
                </Link>
                <Link to={ROUTES.MEMBER.HISTORY_TRANSACTION}>
                  <FaHistory /> History Transaction
                </Link>
                <div className='dropdown_item logout' onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </div>
          <div className='content'>{children}</div>
          <ChatBot />
        </div>
      </div>
    </LayoutWrapper>
  )
}
